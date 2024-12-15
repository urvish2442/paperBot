import { useMemo, useState } from "react";
import Head from "next/head";
import PageHeader from "src/content/Management/Subjects/create/PageHeader";
import {
    Box,
    Drawer,
    Grid,
    Hidden,
    useTheme,
    IconButton,
    styled,
} from "@mui/material";
import Scrollbar from "src/components/Scrollbar";

import Sidebar from "src/content/Management/Subjects/create/Sidebar";

import AdditionalInfo from "src/content/Management/Subjects/create/AdditionalInfo";
import GeneralSection from "src/content/Management/Subjects/create/GeneralSection";
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";
import MainComponent from "src/content/Management/Subjects/create/MainComponent";
import { useFormik } from "formik";
import * as Yup from "yup";
import { globalState } from "src/redux/slices/global";
import { useSelector } from "src/redux/store";
import {
    LABEL_FOR_QUESTION_TYPES,
    TOAST_ALERTS,
    TOAST_TYPES,
} from "src/constants/keywords";
import { API_ROUTER } from "src/services/apiRouter";
import { axiosPost } from "src/services/axiosHelper";
import useToaster from "src/hooks/useToaster";

const DrawerWrapper = styled(Drawer)(
    ({ theme }) => `
    width: 400px;
    flex-shrink: 0;
    z-index: 3;

    & > .MuiPaper-root {
        width: 400px;
        height: calc(100% - ${theme.header.height});
        position: absolute;
        top: ${theme.header.height};
        right: 0;
        z-index: 3;
        background: ${theme.colors.alpha.white[10]};
    }
`,
);

const DrawerWrapperMobile = styled(Drawer)(
    ({ theme }) => `
    width: 360px;
    flex-shrink: 0;

  & > .MuiPaper-root {
        width: 360px;
        z-index: 3;
        background: ${theme.colors.alpha.white[30]};
  }
`,
);

const MainContentWrapper = styled(Box)(
    () => `
  flex-grow: 1;
`,
);

const IconButtonToggle = styled(IconButton)(
    ({ theme }) => `
  width: ${theme.spacing(6)};
  height: ${theme.spacing(6)};
`,
);

function ManagementProductCreate() {
    const theme = useTheme();
    const { toaster } = useToaster();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [reset, setReset] = useState(false);
    const [answerReset, setAnswerReset] = useState(false);
    const { filtersData, subjectFiltersData, currentFilter } =
        useSelector(globalState);

    const subjectNames = useMemo(() => {
        return subjectFiltersData?.map((subject) => subject?.model_name);
    }, [subjectFiltersData]);

    const formik = useFormik({
        initialValues: {
            subject: currentFilter?.subject || "",
            type: currentFilter?.type || "",
            question: "",
            answer: "",
            // queDetails: "",
            marks: currentFilter?.marks || 1,
            unit: currentFilter?.unit || "",
            isFormatted: currentFilter?.isFormatted || false,
            submit: null,
        },
        validationSchema: Yup.object({
            subject: Yup.string()
                .oneOf(subjectNames, "Invalid Question Type")
                .required("Subject is required"),
            type: Yup.string()
                .required("Type is required")
                .oneOf(
                    Object.keys(LABEL_FOR_QUESTION_TYPES),
                    "Invalid Question Type",
                ),
            isFormatted: Yup.boolean().required(
                "Formatting status is required",
            ),
            question: Yup.mixed().when("isFormatted", {
                is: false, // When isFormatted is false (simple text input)
                then: Yup.string()
                    .required("Question is required")
                    .min(3, "Question must be at least 3 characters long"),
                otherwise: Yup.object({
                    blocks: Yup.array()
                        .of(
                            Yup.object().shape({
                                data: Yup.object()
                                    .test(
                                        "text-or-content",
                                        "Block data is required",
                                        function (value) {
                                            const hasText =
                                                (value?.text &&
                                                    value.text.trim().length >
                                                        0) ||
                                                false;
                                            const hasContent =
                                                value?.items?.some(
                                                    (item) =>
                                                        item.content &&
                                                        item.content.trim()
                                                            .length > 0,
                                                ) || false;
                                            return hasText || hasContent;
                                        },
                                    )
                                    // .required("Block data is required"),
                            }),
                        )
                        .min(1, "At least one block is required")
                        .required("Blocks are required"),
                }).required("Question is required when formatted"),
            }),
            answer: Yup.string().trim().required("Answer is required"),
            // answer: Yup.object({
            //     blocks: Yup.array()
            //         .of(
            //             Yup.object().shape({
            //                 data: Yup.object()
            //                     .test(
            //                         "text-or-content",
            //                         "Block data is required",
            //                         function (value) {
            //                             const hasText =
            //                                 (value?.text &&
            //                                     value.text.trim().length > 0) ||
            //                                 false;
            //                             const hasContent =
            //                                 value?.items?.some(
            //                                     (item) =>
            //                                         item.content &&
            //                                         item.content.trim().length >
            //                                             0,
            //                                 ) || false;
            //                             return hasText || hasContent;
            //                         },
            //                     )
            //                     .required("Block data is required"),
            //             }),
            //         )
            //         .min(1, "At least one block is required")
            //         .required("Blocks are required"),
            // }).required("Answer is required"),
            // queDetails: Yup.string()
            //     .max(2000, "Details cannot exceed 2000 characters")
            //     .nullable(), // Optional field
            marks: Yup.number("Enter valid marks").required(
                "Marks is required",
            ),
            unit: Yup.string("Select valid unit").required("Unit is required"),
        }),
        onSubmit: async (values, helpers) => {
            try {
                helpers.setSubmitting(true);
                const { subject, submit, ...rest } = values;
                const { data, status, message } = await axiosPost(
                    API_ROUTER.CREATE_QUESTION_BY_SUBJECT(values?.subject),
                    { ...rest },
                );
                if (status) {
                    currentFilter?.isFormatted && setReset(true);
                    toaster(
                        TOAST_TYPES.SUCCESS,
                        TOAST_ALERTS.QUESTION_CREATE_SUCCESS,
                    );
                    helpers.resetForm();
                    helpers.setValues((preVal) => ({
                        ...preVal,
                        type: currentFilter?.type,
                        unit: currentFilter?.unit,
                        isFormatted: currentFilter?.isFormatted,
                    }));
                    // setAnswerReset(true);
                } else {
                    toaster(
                        TOAST_TYPES.ERROR,
                        message || TOAST_ALERTS.GENERAL_ERROR,
                    );
                }
                helpers.setSubmitting(false);
            } catch (error) {
                helpers.setSubmitting(false);
                helpers.setErrors({
                    submit: "An error occurred while submitting the form.",
                });
            }
        },
    });

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const sidebarContent = (
        <Scrollbar>
            <Sidebar />
        </Scrollbar>
    );

    return (
        <>
            <Head>
                <title>Create Question</title>
            </Head>
            <Box mb={3} display="flex">
                <MainContentWrapper>
                    <form noValidate onSubmit={formik.handleSubmit}>
                        <Grid
                            sx={{ px: 4 }}
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="stretch"
                            spacing={3}
                        >
                            <Grid item xs={12}>
                                <Box
                                    mt={3}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <PageHeader />
                                    {/* <Hidden lgUp>
                                    <IconButtonToggle
                                        sx={{ ml: 2 }}
                                        color="primary"
                                        onClick={handleDrawerToggle}
                                        size="small"
                                    >
                                        <MenuTwoToneIcon />
                                    </IconButtonToggle>
                                </Hidden> */}
                                </Box>
                            </Grid>
                            <MainComponent
                                formik={formik}
                                subjectNames={subjectNames}
                                reset={reset}
                                setReset={setReset}
                                answerReset={answerReset}
                                setAnswerReset={setAnswerReset}
                            />
                        </Grid>
                    </form>
                </MainContentWrapper>
                {/* <Hidden lgUp>
                    <DrawerWrapperMobile
                        variant="temporary"
                        anchor={theme.direction === "rtl" ? "left" : "right"}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                    >
                        {sidebarContent}
                    </DrawerWrapperMobile>
                </Hidden>
                <Hidden lgDown>
                    <DrawerWrapper
                        variant="permanent"
                        anchor={theme.direction === "rtl" ? "left" : "right"}
                        open
                    >
                        {sidebarContent}
                    </DrawerWrapper>
                </Hidden> */}
            </Box>
        </>
    );
}

export default ManagementProductCreate;

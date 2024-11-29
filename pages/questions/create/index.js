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
import { LABEL_FOR_QUESTION_TYPES } from "src/constants/keywords";

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

    const [mobileOpen, setMobileOpen] = useState(false);
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
            queDetails: "",
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
            question: Yup.string()
                .min(10, "Question should have at least 10 characters")
                .max(1000, "Question cannot exceed 1000 characters")
                .required("Question is required"),
            answer: Yup.string()
                .min(1, "Answer should have at least 1 character")
                .max(1000, "Answer cannot exceed 1000 characters")
                .required("Answer is required"),
            queDetails: Yup.string()
                .max(2000, "Details cannot exceed 2000 characters")
                .nullable(), // Optional field
            isFormatted: Yup.boolean().required(
                "Formatting status is required",
            ),
        }),
        onSubmit: async (values, helpers) => {
            try {
                // Handle form submission
                console.log("Form Submitted:", values);
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

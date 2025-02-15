import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Box, Grid, styled } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "src/redux/store";
import { globalState, setCurrentFilter } from "src/redux/slices/global";
import { axiosGet, axiosPut } from "src/services/axiosHelper";
import { API_ROUTER } from "src/services/apiRouter";
import useToaster from "src/hooks/useToaster";
import PageHeader from "src/content/Management/Subjects/create/PageHeader";
import MainComponent from "src/content/Management/Questions/create/MainComponent";
import { useDispatch } from "react-redux";
import Loader from "src/components/Loader";
import { PATH_DASHBOARD } from "src/routes/paths";
import { TOAST_ALERTS, TOAST_TYPES } from "src/constants/keywords";

const MainContentWrapper = styled(Box)(
    () => `
  flex-grow: 1;
`,
);

function UpdateQuestion() {
    const router = useRouter();
    const storeDispatch = useDispatch();
    const { subject, questionId } = router.query;
    const { toaster } = useToaster();
    const { subjectFiltersData, currentFilter } = useSelector(globalState);
    const [reset, setReset] = useState(false);
    const [loading, setLoading] = useState(true);

    const subjectNames = useMemo(() => {
        return subjectFiltersData
            ?.filter((subj) => subj?.isActive)
            .map((subj) => subj?.model_name);
    }, [subjectFiltersData]);

    const [initialValues, setInitialValues] = useState({
        subject: subject || "",
        type: "",
        question: "",
        answer: "",
        marks: 1,
        unit: "",
        isFormatted: false,
    });

    useEffect(() => {
        if (subject && questionId) {
            fetchQuestionDetails();
        } else {
            router.push(PATH_DASHBOARD.questions.root);
        }
    }, [subject, questionId]);

    const fetchQuestionDetails = async () => {
        try {
            const { data, status } = await axiosGet(
                API_ROUTER.GET_QUESTION_BY_ID(subject, questionId),
            );
            if (status) {
                storeDispatch(setCurrentFilter({ subject }));
                setInitialValues({
                    subject: subject,
                    type: data.type,
                    question: data.question,
                    answer: data.answer,
                    marks: data.marks,
                    unit: data.unit,
                    isFormatted: data.isFormatted,
                });
            } else {
                toaster(TOAST_TYPES.ERROR, "Failed to fetch question details");
                router.push(PATH_DASHBOARD.questions.root);
            }
        } catch (error) {
            toaster("error", "Failed to fetch question details");
        } finally {
            setLoading(false);
        }
    };

    const validationSchema = Yup.object({
        subject: Yup.string()
            .oneOf(subjectNames, "Invalid Question Type")
            .required("Subject is required"),
        type: Yup.string().required("Type is required"),
        isFormatted: Yup.boolean().required("Formatting status is required"),
        question: Yup.mixed().when("isFormatted", {
            is: false,
            then: Yup.string()
                .required("Question is required")
                .min(3, "Question must be at least 3 characters long"),
            otherwise: Yup.object()
                .shape({
                    blocks: Yup.array()
                        .of(
                            Yup.object().shape({
                                data: Yup.object().test(
                                    "text-or-content",
                                    "Block data is required",
                                    function (value) {
                                        const hasText =
                                            value?.text?.trim().length > 0 ||
                                            false;
                                        const hasContent =
                                            value?.items?.some(
                                                (item) =>
                                                    item.content?.trim()
                                                        .length > 0,
                                            ) || false;
                                        return hasText || hasContent;
                                    },
                                ),
                            }),
                        )
                        .min(1, "At least one block is required")
                        .required("Blocks are required"),
                })
                .required("Question is required when formatted"),
        }),
        answer: Yup.string().trim().required("Answer is required"),
        marks: Yup.number()
            .typeError("Enter valid marks")
            .required("Marks is required"),
        unit: Yup.string().required("Unit is required"),
    });

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values, helpers) => {
            try {
                helpers.setSubmitting(true);
                const { data, status, message } = await axiosPut(
                    API_ROUTER.GET_QUESTION_BY_ID(subject, questionId),
                    values,
                );
                if (status) {
                    toaster(
                        TOAST_TYPES.SUCCESS,
                        TOAST_ALERTS.QUESTION_UPDATE_SUCCESS,
                    );
                    router.push(PATH_DASHBOARD.questions.root);
                } else {
                    toaster(
                        TOAST_TYPES.ERROR,
                        message || "Failed to update question",
                    );
                }
                helpers.setSubmitting(false);
            } catch (error) {
                helpers.setSubmitting(false);
                toaster(TOAST_TYPES.ERROR, "An error occurred while updating");
            }
        },
    });

    if (loading) return <Loader size={40} />;

    return (
        <>
            <Head>
                <title>Update Question</title>
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
                                    <PageHeader isEdit={true} />
                                </Box>
                            </Grid>
                            <MainComponent
                                formik={formik}
                                subjectNames={subjectNames}
                                reset={reset}
                                setReset={setReset}
                                isEdit={true}
                            />
                        </Grid>
                    </form>
                </MainContentWrapper>
            </Box>
        </>
    );
}

export default UpdateQuestion;

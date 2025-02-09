import { useTranslation } from "react-i18next";
import Link from "src/components/Link";

import {
    Grid,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    TextField,
} from "@mui/material";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useState } from "react";
import { API_ROUTER } from "src/services/apiRouter";
import { axiosPost } from "src/services/axiosHelper";
import useToaster from "src/hooks/useToaster";
import { TOAST_ALERTS, TOAST_TYPES } from "src/constants/keywords";
import { useDispatch } from "react-redux";
import { getFiltersAction } from "src/redux/actions/action";

function PageHeader() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { toaster } = useToaster();

    const [open, setOpen] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().max(100).required(t("Name field is required")),
            description: Yup.string()
                .max(255)
                .required(t("Description field is required")),
        }),
        onSubmit: async (
            values,
            { resetForm, setErrors, setStatus, setSubmitting },
        ) => {
            try {
                const { data, status, message } = await axiosPost(
                    API_ROUTER.QUESTION_TYPES,
                    values,
                );
                if (status) {
                    toaster(
                        TOAST_TYPES.SUCCESS,
                        TOAST_ALERTS.QUESTION_TYPE_CREATE_SUCCESS,
                    );
                    resetForm();
                    setStatus({ success: true });
                    setOpen(false);
                    dispatch(getFiltersAction());
                } else {
                    console.log("first");
                    const formikErrors =
                        typeof data === "object"
                            ? data?.reduce((acc, error) => {
                                  const fieldName = Object.keys(error)[0];
                                  acc[fieldName] = error[fieldName];
                                  return acc;
                              }, {})
                            : {};
                    setStatus({ success: false });
                    setErrors(formikErrors);
                    toaster(
                        TOAST_TYPES.ERROR,
                        message || TOAST_ALERTS.GENERAL_ERROR,
                    );
                }
                setSubmitting(false);
            } catch (err) {
                console.error(err);
                // setStatus({ success: false });
                // setErrors({ submit: err.message });
                setSubmitting(false);
            }
        },
    });

    const handleCreateModalOpen = () => {
        setOpen(true);
    };

    const handleCreateModalClose = () => {
        setOpen(false);
    };

    return (
        <>
            {" "}
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h3" component="h3" gutterBottom>
                        {t("Question Types")}
                    </Typography>
                    {/* <Typography variant="subtitle2">
                        {t("Use this page to manage your Question Types.")}
                    </Typography> */}
                </Grid>
                <Grid item>
                    <Button
                        sx={{
                            mt: { xs: 2, sm: 0 },
                        }}
                        onClick={handleCreateModalOpen}
                        variant="contained"
                        startIcon={<AddTwoToneIcon fontSize="small" />}
                    >
                        {t("Create Question Type")}
                    </Button>
                </Grid>
            </Grid>
            <Dialog
                fullWidth
                maxWidth="md"
                open={open}
                onClose={handleCreateModalClose}
            >
                <DialogTitle
                    sx={{
                        p: 3,
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        {t("Add new Question Type")}
                    </Typography>
                    <Typography variant="subtitle2">
                        {t(
                            "Fill in the fields below to create and add a new Question Type",
                        )}
                    </Typography>
                </DialogTitle>
                <form onSubmit={formik.handleSubmit}>
                    <DialogContent dividers sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    error={Boolean(
                                        formik.touched.name &&
                                            formik.errors.name,
                                    )}
                                    fullWidth
                                    helperText={
                                        formik.touched.name &&
                                        formik.errors.name
                                    }
                                    label={t("Name")}
                                    name="name"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.name}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={Boolean(
                                        formik.touched.description &&
                                            formik.errors.description,
                                    )}
                                    fullWidth
                                    helperText={
                                        formik.touched.description &&
                                        formik.errors.description
                                    }
                                    label={t("Description")}
                                    name="description"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.description}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button
                            color="secondary"
                            onClick={handleCreateModalClose}
                        >
                            {t("Cancel")}
                        </Button>
                        <Button
                            type="submit"
                            startIcon={
                                formik.isSubmitting ? (
                                    <CircularProgress size="1rem" />
                                ) : null
                            }
                            disabled={
                                Boolean(formik.errors.submit) ||
                                formik.isSubmitting
                            }
                            variant="contained"
                        >
                            {t("Create Question Type")}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}

export default PageHeader;

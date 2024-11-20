import React from "react";
import * as Yup from "yup";
import { Formik, useFormik } from "formik";
import {
    Box,
    TextField,
    Button,
    Typography,
    Card,
    Alert,
    CircularProgress,
} from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { API_ROUTER } from "src/services/apiRouter";
import useToaster from "src/hooks/useToaster";
import { TOAST_ALERTS, TOAST_TYPES } from "src/constants/keywords";
import { axiosPost } from "src/services/axiosHelper";
import { PATH_AUTH } from "src/routes/paths";

const ResetPasswordBlock = ({ otp }) => {
    const { t } = useTranslation();
    const { push } = useRouter();
    const { toaster } = useToaster();

    const formik = useFormik({
        initialValues: {
            otp: otp || "",
            password: "",
            confirm_password: "",
            submit: null,
        },
        validationSchema: Yup.object().shape({
            otp: Yup.string()
                .required(t("OTP is required"))
                .matches(/^\d{6}$/, t("OTP should be a 6-digit number")),
            password: Yup.string()
                .min(8, t("Password must be at least 8 characters"))
                .required(t("Password is required")),
            confirm_password: Yup.string()
                .oneOf([Yup.ref("password"), null], t("Passwords must match"))
                .required(t("Confirm password is required")),
        }),
        onSubmit: async (values, helpers) => {
            try {
                const { status, message } = await axiosPost(
                    API_ROUTER.PASSWORD_RESET,
                    {
                        code: values.otp,
                        password: values.password,
                        confirm_password: values.confirm_password,
                    },
                );
                if (status) {
                    toaster(
                        TOAST_TYPES.SUCCESS,
                        TOAST_ALERTS.PASSWORD_RESET_SUCCESS,
                    );
                    helpers.setStatus({ success: true });
                    push(PATH_AUTH.login);
                } else {
                    toaster(
                        TOAST_TYPES.ERROR,
                        message || TOAST_ALERTS.GENERAL_ERROR,
                    );
                }
                helpers.setSubmitting(false);
            } catch (err) {
                console.error(err);
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    return (
        <Card
            sx={{
                mt: 3,
                p: 4,
            }}
        >
            <form noValidate onSubmit={formik.handleSubmit}>
                <Typography
                    variant="h5"
                    sx={{
                        mb: 3,
                    }}
                >
                    {t("Reset your password")}
                </Typography>

                <TextField
                    error={Boolean(formik.touched.otp && formik.errors.otp)}
                    fullWidth
                    helperText={formik.touched.otp && formik.errors.otp}
                    label={t("OTP")}
                    margin="normal"
                    name="otp"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.otp}
                    variant="outlined"
                />

                <TextField
                    error={Boolean(
                        formik.touched.password && formik.errors.password,
                    )}
                    fullWidth
                    helperText={
                        formik.touched.password && formik.errors.password
                    }
                    label={t("New Password")}
                    margin="normal"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.password}
                    variant="outlined"
                />

                <TextField
                    error={Boolean(
                        formik.touched.confirm_password &&
                            formik.errors.confirm_password,
                    )}
                    fullWidth
                    helperText={
                        formik.touched.confirm_password &&
                        formik.errors.confirm_password
                    }
                    label={t("Confirm New Password")}
                    margin="normal"
                    name="confirm_password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.confirm_password}
                    variant="outlined"
                />

                {formik.errors.submit && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {formik.errors.submit}
                    </Alert>
                )}

                <Button
                    sx={{ mt: 3 }}
                    color="primary"
                    startIcon={
                        formik.isSubmitting ? (
                            <CircularProgress size="1rem" />
                        ) : null
                    }
                    disabled={formik.isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                >
                    {t("Reset Password")}
                </Button>
            </form>
        </Card>
    );
};

export default ResetPasswordBlock;

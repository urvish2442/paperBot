import * as Yup from "yup";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import Link from "src/components/Link";

import {
    Box,
    Button,
    FormHelperText,
    TextField,
    Checkbox,
    Typography,
    FormControlLabel,
    CircularProgress,
} from "@mui/material";
import { useAuth } from "src/hooks/useAuth";
import { useRefMounted } from "src/hooks/useRefMounted";
import { useTranslation } from "react-i18next";
import useToaster from "src/hooks/useToaster";
import { TOAST_ALERTS, TOAST_TYPES } from "src/constants/keywords";
import { useState } from "react";
import { PATH_AUTH, PATH_DASHBOARD } from "src/routes/paths";

export const LoginJWT = ({ setOtp,setEmail, ...rest }) => {
    const { t } = useTranslation();
    const { login } = useAuth();
    const isMountedRef = useRefMounted();
    const router = useRouter();
    const { toaster } = useToaster();

    const formik = useFormik({
        initialValues: {
            email: "r.urvish@gmail.com",
            password: "admin@123",
            terms: true,
            submit: null,
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email(t("The email provided should be a valid email address"))
                .max(255)
                .required(t("The email field is required")),
            password: Yup.string()
                .max(255)
                .required(t("The password field is required")),
            // terms: Yup.boolean().oneOf(
            //     [true],
            //     t("You must agree to our terms and conditions")
            // )
        }),
        onSubmit: async (values, helpers) => {
            const { email, password } = values;
            try {
                const { status, data, message } = await login(email, password);
                if (status) {
                    toaster(TOAST_TYPES.SUCCESS, TOAST_ALERTS.OTP_SENT_SUCCESS);
                    setEmail(email);
                    setOtp(data?.otp);
                } else {
                    toaster(
                        TOAST_TYPES.ERROR,
                        message || TOAST_ALERTS.GENERAL_ERROR,
                    );
                }
            } catch (err) {
                console.error(err);
                if (isMountedRef()) {
                    helpers.setStatus({ success: false });
                    helpers.setErrors({ submit: err.message });
                    helpers.setSubmitting(false);
                }
            }
        },
    });

    return (
        <form noValidate onSubmit={formik.handleSubmit} {...rest}>
            <TextField
                error={Boolean(formik.touched.email && formik.errors.email)}
                fullWidth
                margin="normal"
                autoFocus
                helperText={formik.touched.email && formik.errors.email}
                label={t("Email address")}
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="email"
                value={formik.values.email}
                variant="outlined"
            />
            <TextField
                error={Boolean(
                    formik.touched.password && formik.errors.password,
                )}
                fullWidth
                margin="normal"
                helperText={formik.touched.password && formik.errors.password}
                label={t("Password")}
                name="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="password"
                value={formik.values.password}
                variant="outlined"
            />
            <Box
                alignItems="center"
                display={{ xs: "block", md: "flex" }}
                justifyContent="end"
            >
                {/* <Box display={{ xs: "block", md: "flex" }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formik.values.terms}
                                name="terms"
                                color="primary"
                                onChange={formik.handleChange}
                            />
                        }
                        label={
                            <>
                                <Typography variant="body2">
                                    {t("I accept the")}{" "}
                                    <Link href="#">
                                        {t("terms and conditions")}
                                    </Link>
                                    .
                                </Typography>
                            </>
                        }
                    />
                </Box> */}
                <Link href={PATH_AUTH.forgotPassword}>
                    <b>{t("Forgot password?")}</b>
                </Link>
            </Box>

            {Boolean(formik.touched.terms && formik.errors.terms) && (
                <FormHelperText error>{formik.errors.terms}</FormHelperText>
            )}

            <Button
                sx={{
                    mt: 3,
                }}
                color="primary"
                startIcon={
                    formik.isSubmitting ? (
                        <CircularProgress size="1rem" />
                    ) : null
                }
                disabled={formik.isSubmitting}
                type="submit"
                fullWidth
                size="large"
                variant="contained"
            >
                {t("Sign in")}
            </Button>
        </form>
    );
};

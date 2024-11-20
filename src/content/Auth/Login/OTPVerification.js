import * as Yup from "yup";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import Link from "src/components/Link";

import {
    Box,
    Button,
    FormHelperText,
    TextField,
    CircularProgress,
    Typography,
} from "@mui/material";
import { useAuth } from "src/hooks/useAuth";
import { useRefMounted } from "src/hooks/useRefMounted";
import { useTranslation } from "react-i18next";
import useToaster from "src/hooks/useToaster";
import { TOAST_ALERTS, TOAST_TYPES } from "src/constants/keywords";
import { useState, useEffect } from "react";
import { PATH_DASHBOARD } from "src/routes/paths";
import { saveData } from "src/utils/custom/storage";

export const OTPVerification = ({ otp, setOtp = () => {} }) => {
    const { t } = useTranslation();
    const { verifyOtp } = useAuth();
    const isMountedRef = useRefMounted();
    const router = useRouter();
    const { toaster } = useToaster();

    const formik = useFormik({
        initialValues: {
            otp: otp,
            submit: null,
        },
        validationSchema: Yup.object({
            otp: Yup.string()
                .length(6, t("The OTP should be exactly 6 digits"))
                .required(t("The OTP field is required")),
        }),
        onSubmit: async (values, helpers) => {
            const { otp } = values;
            try {
                const { status, data, message } = await verifyOtp(otp);

                if (status) {
                    toaster(TOAST_TYPES.SUCCESS, TOAST_ALERTS.LOGIN_SUCCESS);
                    if (isMountedRef()) {
                        const backTo =
                            router.query.backTo || PATH_DASHBOARD.root;
                        router.push(backTo);
                    }
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
        <form noValidate onSubmit={formik.handleSubmit}>
            <>
                <TextField
                    error={Boolean(formik.touched.otp && formik.errors.otp)}
                    fullWidth
                    margin="normal"
                    helperText={formik.touched.otp && formik.errors.otp}
                    label={t("Enter OTP")}
                    name="otp"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.otp}
                    variant="outlined"
                />
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
                    {t("Verify OTP")}
                </Button>
            </>
        </form>
    );
};

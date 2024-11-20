import * as Yup from "yup";
import { useRouter } from "next/router";
import { useFormik } from "formik";

import Link from "src/components/Link";

import {
    Button,
    Checkbox,
    FormHelperText,
    TextField,
    Typography,
    FormControlLabel,
    CircularProgress,
} from "@mui/material";
import { useAuth } from "src/hooks/useAuth";
import { useRefMounted } from "src/hooks/useRefMounted";
import { useTranslation } from "react-i18next";
import { TOAST_ALERTS, TOAST_TYPES } from "src/constants/keywords";
import useToaster from "src/hooks/useToaster";
import { PATH_AUTH } from "src/routes/paths";

export const RegisterJWT = (props) => {
    const { register } = useAuth();
    const isMountedRef = useRefMounted();
    const { t } = useTranslation();
    const router = useRouter();
    const { toaster } = useToaster();


    const formik = useFormik({
        initialValues: {
            email: "",
            username: "",
            password: "",
            // terms: false,
            submit: null,
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email(t("The email provided should be a valid email address"))
                .max(255)
                .required(t("The email field is required")),
            username: Yup.string()
                .max(255)
                .required(t("The name field is required")),
            password: Yup.string()
                .min(8)
                .max(255)
                .required(t("The password field is required")),
            // terms: Yup.boolean().oneOf(
            //     [true],
            //     t("You must agree to our terms and conditions"),
            // ),
        }),
        onSubmit: async (values, helpers) => {
            try {
                const { username, email, password } = values;
                const { status, data, message } = await register(
                    username,
                    email,
                    password,
                );

                if (status) {
                    toaster(TOAST_TYPES.SUCCESS, TOAST_ALERTS.REGISTER_SUCCESS);
                } else {
                    toaster(
                        TOAST_TYPES.ERROR,
                        message || TOAST_ALERTS.GENERAL_ERROR,
                    );
                }

                if (isMountedRef()) {
                    const backTo = PATH_AUTH.login;
                    router.push(backTo);
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
        <form noValidate onSubmit={formik.handleSubmit} {...props}>
            <TextField
                error={Boolean(formik.touched.email && formik.errors.email)}
                fullWidth
                margin="normal"
                helperText={formik.touched.email && formik.errors.email}
                label={t("Email")}
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="email"
                value={formik.values.email}
                variant="outlined"
            />
            <TextField
                error={Boolean(
                    formik.touched.username && formik.errors.username,
                )}
                fullWidth
                margin="normal"
                helperText={formik.touched.username && formik.errors.username}
                label={t("Username")}
                name="username"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.username}
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
            {/* <FormControlLabel
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
                            <Link href="#">{t("terms and conditions")}</Link>.
                        </Typography>
                    </>
                }
            />
            {Boolean(formik.touched.terms && formik.errors.terms) && (
                <FormHelperText error>{formik.errors.terms}</FormHelperText>
            )} */}
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
                {t("Create your account")}
            </Button>
        </form>
    );
};

import { useState, forwardRef, Ref } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
    Box,
    Card,
    TextField,
    Typography,
    Container,
    Button,
    styled,
    CircularProgress,
} from "@mui/material";
import Head from "next/head";
import { useRefMounted } from "src/hooks/useRefMounted";
import Link from "src/components/Link";
import { useTranslation } from "react-i18next";
import Logo from "src/components/LogoSign";
import { PATH_AUTH } from "src/routes/paths";
import { API_ROUTER } from "src/services/apiRouter";
import useToaster from "src/hooks/useToaster";
import { TOAST_ALERTS, TOAST_TYPES } from "src/constants/keywords";
import ResetPasswordBlock from "src/content/Auth/ResetPassword/ResetPasswordBlock";
import { axiosPost } from "src/services/axiosHelper";

const MainContent = styled(Box)(
    () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`,
);

function RecoverPasswordBasic() {
    const { t } = useTranslation();
    const isMountedRef = useRefMounted();
    const { toaster } = useToaster();

    const [otp, setOtp] = useState("");

    const formik = useFormik({
        initialValues: {
            email: "",
            submit: null,
        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .email(t("The email provided should be a valid email address"))
                .max(255)
                .required(t("The email field is required")),
        }),
        onSubmit: async (_values, helpers) => {
            try {
                const { data, status } = await axiosPost(
                    API_ROUTER.REQUEST_PASSWORD_RESET,
                    {
                        email: _values.email,
                    },
                );

                if (isMountedRef()) {
                    helpers.setStatus({
                        success: true,
                    });
                    helpers.setSubmitting(false);
                }
                if (status) {
                    setOtp(data?.otp);
                    toaster(TOAST_TYPES.SUCCESS, TOAST_ALERTS.OTP_SENT_SUCCESS);
                } else {
                    toaster(TOAST_TYPES.ERROR, TOAST_ALERTS.GENERAL_ERROR);
                }
            } catch (err) {
                console.error(err);
                if (isMountedRef()) {
                    helpers.setStatus({
                        success: false,
                    });
                    helpers.setErrors({
                        submit: err.message,
                    });
                    helpers.setSubmitting(false);
                }
            }
        },
    });

    return (
        <>
            <Head>
                <title>Recover Password</title>
            </Head>
            <MainContent>
                <Container maxWidth="sm">
                    <Logo />
                    <Card
                        sx={{
                            mt: 3,
                            p: 4,
                        }}
                    >
                        <Box>
                            <Typography
                                variant="h2"
                                sx={{
                                    mb: 1,
                                }}
                            >
                                {!otp
                                    ? t("Recover Password")
                                    : t("Reset Password")}
                            </Typography>
                            <Typography
                                variant="h4"
                                color="text.secondary"
                                fontWeight="normal"
                                sx={{
                                    mb: 3,
                                }}
                            >
                                {!otp
                                    ? t(
                                          "Enter the email used for registration to reset your password.",
                                      )
                                    : t("Enter your new password.")}
                            </Typography>
                        </Box>

                        {!otp && (
                            <form noValidate onSubmit={formik.handleSubmit}>
                                <TextField
                                    error={Boolean(
                                        formik.touched.email &&
                                            formik.errors.email,
                                    )}
                                    fullWidth
                                    helperText={
                                        formik.touched.email &&
                                        formik.errors.email
                                    }
                                    label={t("Email address")}
                                    margin="normal"
                                    name="email"
                                    placeholder="demo@example.com"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="email"
                                    value={formik.values.email}
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
                                    disabled={Boolean(
                                        (formik.touched.email &&
                                            formik.errors.email) ||
                                            formik.isSubmitting,
                                    )}
                                    type="submit"
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                >
                                    {t("Send OTP")}
                                </Button>
                            </form>
                        )}
                        {otp && <ResetPasswordBlock otp={otp} />}
                    </Card>
                    <Box mt={3} textAlign="right">
                        <Typography
                            component="span"
                            variant="subtitle2"
                            color="text.primary"
                            fontWeight="bold"
                        >
                            {t("Want to try to sign in again?")}
                        </Typography>{" "}
                        <Link href={PATH_AUTH.login}>
                            <b>Click here</b>
                        </Link>
                    </Box>
                </Container>
            </MainContent>
        </>
    );
}

RecoverPasswordBasic.guestLayout = true;

export default RecoverPasswordBasic;

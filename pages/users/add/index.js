import * as Yup from "yup";
import { useFormik } from "formik";
import {
    Box,
    Card,
    TextField,
    Typography,
    Container,
    Grid,
    Button,
    CircularProgress,
    Autocomplete,
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { API_ROUTER } from "src/services/apiRouter";
import useToaster from "src/hooks/useToaster";
import { TOAST_ALERTS, TOAST_TYPES } from "src/constants/keywords";
import { axiosPost } from "src/services/axiosHelper";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import countriesData from "src/content/Management/Users/countries";
import { PATH_DASHBOARD } from "src/routes/paths";

function AddUserPage() {
    const { t } = useTranslation();
    const { push } = useRouter();
    const { toaster } = useToaster();

    const formik = useFormik({
        initialValues: {
            email: "",
            username: "",
            first_name: "",
            last_name: "",
            country: "",
            commission_percentage: "",
        },
        validationSchema: Yup.object().shape({
            username: Yup.string()
                .matches(
                    /^[a-zA-Z0-9_]*$/,
                    t(
                        "Username can only contain letters, numbers, and underscores",
                    ),
                )
                // .trim(t("Please enter a valid first name"))
                .required(t("The username field is required"))
                .min(3, t("Username must be at least 3 characters long"))
                .max(100, t("Username cannot exceed 100 characters")),

            first_name: Yup.string()
                // .required(t("The first name field is required"))
                .matches(
                    /^[a-zA-Z]*$/,
                    t("First name can only contain letters"),
                )
                // .trim(t("Please enter a valid first name"))
                .min(2, t("First name must be at least 2 characters long"))
                .max(50, t("First name cannot exceed 50 characters")),

            last_name: Yup.string()
                // .required(t("The last name field is required"))
                .matches(/^[a-zA-Z]*$/, t("Last name can only contain letters"))
                // .trim(t("Please enter a valid last name"))
                .min(2, t("Last name must be at least 2 characters long"))
                .max(50, t("Last name cannot exceed 50 characters")),

            email: Yup.string()
                .required(t("The email field is required"))
                .email(t("The email provided should be a valid email address"))
                .max(255, t("Email cannot exceed 255 characters")),

            country: Yup.string()
                // .required(t("The country field is required"))
                .max(100, t("Country cannot exceed 100 characters")),

            commission_percentage: Yup.number()
                .required(t("The commission percentage field is required"))
                .typeError(t("Commission percentage must be a number"))
                .min(0, t("Commission percentage must be at least 0%"))
                .max(100, t("Commission percentage cannot exceed 100%")),
        }),
        onSubmit: async (_values, helpers) => {
            try {
                const { data, status } = await axiosPost(
                    API_ROUTER.CREATE_CREATOR,
                    _values,
                );
                if (status) {
                    toaster(
                        TOAST_TYPES.SUCCESS,
                        TOAST_ALERTS.USER_CREATE_SUCCESS,
                    );
                    push(PATH_DASHBOARD.users.root);
                } else {
                    toaster(TOAST_TYPES.ERROR, TOAST_ALERTS.GENERAL_ERROR);
                }
            } catch (err) {
                console.error(err);
                helpers.setErrors({
                    submit: err.message,
                });
            }
            helpers.setSubmitting(false);
        },
    });

    return (
        <>
            <Head>
                <title>Add User</title>
            </Head>
            <PageTitleWrapper>
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Grid item>
                        <Typography variant="h3" component="h3" gutterBottom>
                            {t("Add New user")}
                        </Typography>
                        <Typography variant="subtitle2">
                            {t(
                                "Fill in the fields below to create and add a new user to the site.",
                            )}
                        </Typography>
                    </Grid>
                </Grid>
            </PageTitleWrapper>
            <Container maxWidth="md">
                <Card sx={{ mt: 3, p: 4 }}>
                    <form noValidate onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} lg={12}>
                                <Grid container spacing={5}>
                                    <Grid item xs={12}>
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
                                            name="email"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            type="email"
                                            value={formik.values.email}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            error={Boolean(
                                                formik.touched.username &&
                                                    formik.errors.username,
                                            )}
                                            fullWidth
                                            helperText={
                                                formik.touched.username &&
                                                formik.errors.username
                                            }
                                            label={t("Username")}
                                            name="username"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.username}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            error={Boolean(
                                                formik.touched.first_name &&
                                                    formik.errors.first_name,
                                            )}
                                            fullWidth
                                            helperText={
                                                formik.touched.first_name &&
                                                formik.errors.first_name
                                            }
                                            label={t("First name")}
                                            name="first_name"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.first_name}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            error={Boolean(
                                                formik.touched.last_name &&
                                                    formik.errors.last_name,
                                            )}
                                            fullWidth
                                            helperText={
                                                formik.touched.last_name &&
                                                formik.errors.last_name
                                            }
                                            label={t("Last name")}
                                            name="last_name"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.last_name}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Autocomplete
                                            id="country-select"
                                            options={countriesData}
                                            autoHighlight
                                            getOptionLabel={(option) =>
                                                option.label
                                            }
                                            isOptionEqualToValue={(
                                                option,
                                                value,
                                            ) => option.label === value.label}
                                            value={
                                                countriesData.find(
                                                    (country) =>
                                                        country.label ===
                                                        formik.values.country,
                                                ) || null
                                            }
                                            onChange={(event, newValue) => {
                                                formik.setFieldValue(
                                                    "country",
                                                    newValue
                                                        ? newValue.label
                                                        : "",
                                                );
                                            }}
                                            renderOption={(props, option) => (
                                                <Box
                                                    component="li"
                                                    sx={{
                                                        "& > img": {
                                                            mr: 2,
                                                            flexShrink: 0,
                                                        },
                                                    }}
                                                    {...props}
                                                >
                                                    <img
                                                        loading="lazy"
                                                        width="20"
                                                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                                        alt=""
                                                    />
                                                    {option.label} (
                                                    {option.code}) +
                                                    {option.phone}
                                                </Box>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={t("Country")}
                                                    placeholder={t(
                                                        "Select Country...",
                                                    )}
                                                    variant="outlined"
                                                    fullWidth
                                                    error={Boolean(
                                                        formik.touched
                                                            .country &&
                                                            formik.errors
                                                                .country,
                                                    )}
                                                    helperText={
                                                        formik.touched
                                                            .country &&
                                                        formik.errors.country
                                                    }
                                                    onBlur={formik.handleBlur}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            error={Boolean(
                                                formik.touched
                                                    .commission_percentage &&
                                                    formik.errors
                                                        .commission_percentage,
                                            )}
                                            fullWidth
                                            helperText={
                                                formik.touched
                                                    .commission_percentage &&
                                                formik.errors
                                                    .commission_percentage
                                            }
                                            label={t("Commission Percentage")}
                                            name="commission_percentage"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            type="number"
                                            value={
                                                formik.values
                                                    .commission_percentage
                                            }
                                            variant="outlined"
                                            inputProps={{ min: 0, max: 100 }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* <Grid
                                    item
                                    xs={12}
                                    lg={5}
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                >
                                    <Avatar
                                        variant="rounded"
                                        alt="Avatar"
                                        src={formik.values.avatar}
                                        sx={{ width: 100, height: 100 }}
                                    />
                                    <input
                                        accept="image/*"
                                        id="avatar-upload"
                                        type="file"
                                        hidden
                                        onChange={(e) =>
                                            formik.setFieldValue(
                                                "avatar",
                                                URL.createObjectURL(
                                                    e.currentTarget.files[0]
                                                )
                                            )
                                        }
                                    />
                                    <label htmlFor="avatar-upload">
                                        <IconButton
                                            component="span"
                                            color="primary"
                                        >
                                            <CloudUploadTwoToneIcon />
                                        </IconButton>
                                    </label>
                                    <Divider flexItem sx={{ m: 4 }} />
                                    <Typography variant="h4" sx={{ pb: 1 }}>
                                        {t("Public Profile")}
                                    </Typography>
                                    <Switch
                                        checked={formik.values.publicProfile}
                                        onChange={(e) =>
                                            formik.setFieldValue(
                                                "publicProfile",
                                                e.target.checked
                                            )
                                        }
                                        name="publicProfile"
                                        color="primary"
                                    />
                                </Grid> */}
                        </Grid>
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            fullWidth
                            startIcon={
                                formik.isSubmitting ? (
                                    <CircularProgress size="1rem" />
                                ) : null
                            }
                            disabled={formik.isSubmitting}
                            sx={{ mt: 3 }}
                        >
                            {t("Add new user")}
                        </Button>
                    </form>
                </Card>
            </Container>
        </>
    );
}

export default AddUserPage;

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
import {
    LABEL_FOR_BOARDS,
    LABEL_FOR_MEDIUM,
    LABEL_FOR_QUESTION_TYPES,
    LABEL_FOR_STANDARDS,
    LABEL_FOR_SUBJECTS,
    TOAST_ALERTS,
    TOAST_TYPES,
} from "src/constants/keywords";
import { axiosPost } from "src/services/axiosHelper";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import countriesData from "src/content/Management/Users/countries";
import { PATH_DASHBOARD } from "src/routes/paths";
import { useSelector } from "react-redux";
import { globalState } from "src/redux/slices/global";

function AddSubjectPage() {
    const { t } = useTranslation();
    const { push } = useRouter();
    const { toaster } = useToaster();
    const { filtersData } = useSelector(globalState);

    const formik = useFormik({
        initialValues: {
            board: "",
            standard: "",
            name: "",
            medium: "",
            code: "",
            price: "",
        },
        validationSchema: Yup.object().shape({
            board: Yup.string()
                .required(t("The board field is required"))
                .oneOf(
                    Object.keys(LABEL_FOR_BOARDS),
                    t("Invalid board selection"),
                ),
            standard: Yup.string()
                .required(t("The standard field is required"))
                .oneOf(
                    Object.keys(LABEL_FOR_STANDARDS),
                    t("Invalid standard selection"),
                ),
            name: Yup.string()
                .required(t("The name field is required"))
                .oneOf(
                    Object.keys(LABEL_FOR_SUBJECTS),
                    t("Invalid name selection"),
                ),
            medium: Yup.string()
                .required(t("The medium field is required"))
                .oneOf(
                    Object.keys(LABEL_FOR_MEDIUM),
                    t("Invalid medium selection"),
                ),
            code: Yup.string()
                .required(t("The code field is required"))
                .matches(
                    /^[A-Z0-9]*$/,
                    t("Code can only contain capital letters and numbers"),
                )
                .min(2, t("Code must be at least 3 characters long"))
                .max(20, t("Code cannot exceed 20 characters")),
            price: Yup.number()
                .required(t("The price field is required"))
                .typeError(t("Price must be a valid number"))
                .min(0, t("Price must be at least 0"))
                .max(100000, t("Price cannot exceed 100,000")),
        }),
        onSubmit: async (_values, helpers) => {
            try {
                const { data, status } = await axiosPost(
                    API_ROUTER.CREATE_SUBJECT,
                    _values,
                );
                if (status) {
                    toaster(
                        TOAST_TYPES.SUCCESS,
                        TOAST_ALERTS.SUBJECT_CREATE_SUCCESS,
                    );
                    push(PATH_DASHBOARD.subjects.root);
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
                <title>Add Subject</title>
            </Head>
            <PageTitleWrapper>
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Grid item>
                        <Typography variant="h3" component="h3" gutterBottom>
                            {t("Add New subject")}
                        </Typography>
                        <Typography variant="subtitle2">
                            {t(
                                "Fill in the fields below to create and add a new Subject.",
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
                                    <Grid item xs={12} md={6}>
                                        <Autocomplete
                                            id="medium-select"
                                            options={filtersData?.boards?.map(
                                                (board) => ({
                                                    label: LABEL_FOR_BOARDS[
                                                        board
                                                    ],
                                                    value: board,
                                                }),
                                            )}
                                            autoHighlight
                                            getOptionLabel={(option) =>
                                                option.label
                                            }
                                            isOptionEqualToValue={(
                                                option,
                                                value,
                                            ) => option.value === value.value}
                                            value={
                                                filtersData?.boards
                                                    ?.map((board) => ({
                                                        label: LABEL_FOR_BOARDS[
                                                            board
                                                        ],
                                                        value: board,
                                                    }))
                                                    .find(
                                                        (mediumOption) =>
                                                            mediumOption.value ===
                                                            formik.values.board,
                                                    ) || null
                                            }
                                            onChange={(event, newValue) => {
                                                formik.setFieldValue(
                                                    "board",
                                                    newValue
                                                        ? newValue.value
                                                        : "",
                                                );
                                            }}
                                            renderOption={(props, option) => (
                                                <Box {...props}>
                                                    {option.label}
                                                </Box>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={t("Board")}
                                                    placeholder={t(
                                                        "Select board...",
                                                    )}
                                                    error={Boolean(
                                                        formik.touched.board &&
                                                            formik.errors.board,
                                                    )}
                                                    helperText={
                                                        formik.touched.board &&
                                                        formik.errors.board
                                                    }
                                                    onBlur={formik.handleBlur}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Autocomplete
                                            id="medium-select"
                                            options={filtersData?.mediums?.map(
                                                (medium) => ({
                                                    label: LABEL_FOR_MEDIUM[
                                                        medium
                                                    ],
                                                    value: medium,
                                                }),
                                            )}
                                            autoHighlight
                                            getOptionLabel={(option) =>
                                                option.label
                                            }
                                            isOptionEqualToValue={(
                                                option,
                                                value,
                                            ) => option.value === value.value}
                                            value={
                                                filtersData?.mediums
                                                    ?.map((medium) => ({
                                                        label: LABEL_FOR_MEDIUM[
                                                            medium
                                                        ],
                                                        value: medium,
                                                    }))
                                                    .find(
                                                        (mediumOption) =>
                                                            mediumOption.value ===
                                                            formik.values
                                                                .medium,
                                                    ) || null
                                            }
                                            onChange={(event, newValue) => {
                                                formik.setFieldValue(
                                                    "medium",
                                                    newValue
                                                        ? newValue.value
                                                        : "",
                                                );
                                            }}
                                            renderOption={(props, option) => (
                                                <Box {...props}>
                                                    {option.label}
                                                </Box>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={t("Medium")}
                                                    placeholder={t(
                                                        "Select Medium...",
                                                    )}
                                                    error={Boolean(
                                                        formik.touched.medium &&
                                                            formik.errors
                                                                .medium,
                                                    )}
                                                    helperText={
                                                        formik.touched.medium &&
                                                        formik.errors.medium
                                                    }
                                                    onBlur={formik.handleBlur}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Autocomplete
                                            id="subject-select"
                                            options={filtersData?.subjects?.map(
                                                (name) => ({
                                                    label: LABEL_FOR_SUBJECTS[
                                                        name
                                                    ],
                                                    value: name,
                                                }),
                                            )}
                                            autoHighlight
                                            getOptionLabel={(option) =>
                                                option.label
                                            }
                                            isOptionEqualToValue={(
                                                option,
                                                value,
                                            ) => option.value === value.value}
                                            value={
                                                filtersData?.subjects
                                                    ?.map((name) => ({
                                                        label: LABEL_FOR_SUBJECTS[
                                                            name
                                                        ],
                                                        value: name,
                                                    }))
                                                    .find(
                                                        (subjectOption) =>
                                                            subjectOption.value ===
                                                            formik.values.name,
                                                    ) || null
                                            }
                                            onChange={(event, newValue) => {
                                                formik.setFieldValue(
                                                    "name",
                                                    newValue
                                                        ? newValue.value
                                                        : "",
                                                );
                                            }}
                                            renderOption={(props, option) => (
                                                <Box {...props}>
                                                    {option.label}
                                                </Box>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={t("Subject")}
                                                    placeholder={t(
                                                        "Select Subject...",
                                                    )}
                                                    error={Boolean(
                                                        formik.touched.name &&
                                                            formik.errors.name,
                                                    )}
                                                    helperText={
                                                        formik.touched.name &&
                                                        formik.errors.name
                                                    }
                                                    onBlur={formik.handleBlur}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Autocomplete
                                            id="standard-select"
                                            options={filtersData?.standards?.map(
                                                (standard) => ({
                                                    label: LABEL_FOR_STANDARDS[
                                                        standard
                                                    ],
                                                    value: standard,
                                                }),
                                            )}
                                            autoHighlight
                                            getOptionLabel={(option) =>
                                                option.label
                                            }
                                            isOptionEqualToValue={(
                                                option,
                                                value,
                                            ) => option.value === value.value}
                                            value={
                                                filtersData?.standards
                                                    ?.map((standard) => ({
                                                        label: LABEL_FOR_STANDARDS[
                                                            standard
                                                        ],
                                                        value: standard,
                                                    }))
                                                    .find(
                                                        (standardOption) =>
                                                            standardOption.value ===
                                                            formik.values
                                                                .standard,
                                                    ) || null
                                            }
                                            onChange={(event, newValue) => {
                                                formik.setFieldValue(
                                                    "standard",
                                                    newValue
                                                        ? newValue.value
                                                        : "",
                                                );
                                            }}
                                            renderOption={(props, option) => (
                                                <Box {...props}>
                                                    {option.label}
                                                </Box>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={t("Standard")}
                                                    placeholder={t(
                                                        "Select Standard...",
                                                    )}
                                                    error={Boolean(
                                                        formik.touched
                                                            .standard &&
                                                            formik.errors
                                                                .standard,
                                                    )}
                                                    helperText={
                                                        formik.touched
                                                            .standard &&
                                                        formik.errors.standard
                                                    }
                                                    onBlur={formik.handleBlur}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            error={Boolean(
                                                formik.touched.code &&
                                                    formik.errors.code,
                                            )}
                                            fullWidth
                                            helperText={
                                                formik.touched.code &&
                                                formik.errors.code
                                            }
                                            label={t("Code")}
                                            name="code"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.code}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            error={Boolean(
                                                formik.touched.price &&
                                                    formik.errors.price,
                                            )}
                                            fullWidth
                                            helperText={
                                                formik.touched.price &&
                                                formik.errors.price
                                            }
                                            label={t("Price")}
                                            name="price"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            type="number"
                                            value={formik.values.price}
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
                            {t("Add new Subject")}
                        </Button>
                    </form>
                </Card>
            </Container>
        </>
    );
}

export default AddSubjectPage;

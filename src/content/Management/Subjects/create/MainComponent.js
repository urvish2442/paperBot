"use client";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import ReactDOM from "react-dom";

import {
    TextField,
    Grid,
    CardHeader,
    Tab,
    Box,
    Tabs,
    Typography,
    Divider,
    FormControl,
    Checkbox,
    Tooltip,
    InputAdornment,
    FormControlLabel,
    IconButton,
    InputLabel,
    Select,
    Card,
    styled,
    Autocomplete,
    Button,
    CircularProgress,
    MenuItem,
    FormHelperText,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import HelpOutlineTwoToneIcon from "@mui/icons-material/HelpOutlineTwoTone";
import { useSelector } from "src/redux/store";
import { globalState, setCurrentFilter } from "src/redux/slices/global";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { LABEL_FOR_QUESTION_TYPES } from "src/constants/keywords";
import { useDispatch } from "react-redux";
import AbcTwoToneIcon from "@mui/icons-material/AbcTwoTone";
import { useRefMounted } from "src/hooks/useRefMounted";
import QuillEditor from "./QuillEditor";
import Preview from "./Preview";
// import Editor from "./Editor";
const Editor = dynamic(() => import("./Editor"), { ssr: false });

const MainComponent = ({ formik, subjectNames }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const isMountedRef = useRefMounted();
    const [editorData, setEditorData] = useState(null);
    const { filtersData, currentFilter, subjectFiltersData } =
        useSelector(globalState);

    const currentUnits = useMemo(() => {
        const matchedSubject = subjectFiltersData.find(
            (subject) => subject.model_name === currentFilter.subject,
        );
        return matchedSubject ? matchedSubject.units : [];
    }, [subjectFiltersData, currentFilter.subject]);

    const handleChange = (event) => {
        const { type, name, value, checked } = event.target;
        const updatedValue = type === "checkbox" ? checked : value;

        dispatch(setCurrentFilter({ [name]: updatedValue }));
        formik.setFieldValue(name, updatedValue);
    };

    useEffect(() => {
        formik.setFieldValue("unit", "");
        dispatch(setCurrentFilter({ unit: null }));
    }, [formik.values.subject]);


    const handleSave = (data) => {
        formik.setFieldValue("question", data);
        setEditorData(data); // Save the editor data for preview
    };
    return (
        <>
            <Grid item xs={12}>
                <Card>
                    {/* <CardHeader title={t("Subject Information")} />
                    <Divider /> */}
                    <Box p={3}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>{t("Subject")}</InputLabel>
                                    <Select
                                        value={formik.values.subject || ""}
                                        onChange={handleChange}
                                        name="subject"
                                        onBlur={formik.handleBlur("subject")}
                                        label={t("Subject")}
                                        error={Boolean(
                                            formik.touched.subject &&
                                                formik.errors.subject,
                                        )}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 200, // Limit the height of the dropdown menu
                                                    overflowY: "hidden",
                                                },
                                            },
                                        }}
                                        style={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            // overflowY: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em>{t("Select Subject...")}</em>
                                        </MenuItem>
                                        {subjectNames.map((subject) => (
                                            <MenuItem
                                                key={subject}
                                                value={subject}
                                            >
                                                {subject.toUpperCase()}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {formik.touched.subject &&
                                        formik.errors.subject && (
                                            <FormHelperText error>
                                                {formik.errors.subject}
                                            </FormHelperText>
                                        )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>{t("Type")}</InputLabel>
                                    <Select
                                        value={formik.values.type || ""}
                                        onChange={handleChange}
                                        onBlur={formik.handleBlur("type")}
                                        label={t("Type")}
                                        name="type"
                                        error={Boolean(
                                            formik.touched.type &&
                                                formik.errors.type,
                                        )}
                                    >
                                        <MenuItem value="">
                                            <em>
                                                {t("Select Question Type...")}
                                            </em>
                                        </MenuItem>
                                        {filtersData?.questionTypes?.map(
                                            (type) => (
                                                <MenuItem
                                                    key={type}
                                                    value={type}
                                                >
                                                    {LABEL_FOR_QUESTION_TYPES[
                                                        type
                                                    ] || type}
                                                </MenuItem>
                                            ),
                                        )}
                                    </Select>
                                    {formik.touched.type &&
                                        formik.errors.type && (
                                            <FormHelperText error>
                                                {formik.errors.type}
                                            </FormHelperText>
                                        )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={6} md={3}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>{t("Unit")}</InputLabel>
                                    <Select
                                        value={formik.values.unit || ""}
                                        onChange={handleChange}
                                        onBlur={formik.handleBlur("unit")}
                                        label={t("Unit")}
                                        name="unit"
                                        error={Boolean(
                                            formik.touched.unit &&
                                                formik.errors.unit,
                                        )}
                                    >
                                        <MenuItem value="">
                                            <em>{t("Select Unit...")}</em>
                                        </MenuItem>
                                        {currentUnits?.map((unit) => (
                                            <MenuItem
                                                key={unit._id}
                                                value={unit._id}
                                            >
                                                {unit.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {formik.touched.unit &&
                                        formik.errors.unit && (
                                            <FormHelperText error>
                                                {formik.errors.unit}
                                            </FormHelperText>
                                        )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={6} md={2}>
                                <TextField
                                    fullWidth
                                    label="Marks"
                                    name={`marks`}
                                    value={formik.values.marks}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.marks &&
                                        Boolean(formik.errors.marks)
                                    }
                                    helperText={
                                        formik.touched.marks &&
                                        formik.errors.marks
                                    }
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="isFormatted"
                                            checked={
                                                formik.values.isFormatted ||
                                                false
                                            }
                                            onChange={handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    }
                                    label={t("Formatted Question")}
                                />
                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{ mt: 1 }}
                                >
                                    {t(
                                        "Enable this to format the question text",
                                    )}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card
                    sx={{
                        p: 3,
                    }}
                >
                    <Grid container spacing={3}>
                        {/* <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="title"
                                placeholder={t("Project title here...")}
                                variant="outlined"
                            />
                        </Grid> */}
                        <Grid item xs={12}>
                            <Box>
                                <h3 style={{ marginTop: "0px" }}>Question:</h3>
                            </Box>
                            <Box>
                                <Editor onSave={handleSave} />
                            </Box>
                            <Box mt={2}>
                                <h3 style={{ marginTop: "0px" }}>
                                    Preview (Question):
                                </h3>
                            </Box>
                            <Box>
                                <Preview data={editorData} />
                            </Box>
                            {formik.touched.question &&
                                formik.errors.question && (
                                    <FormHelperText error>
                                        {formik.errors.question}
                                    </FormHelperText>
                                )}
                            <Box mt={2}>
                                <Button
                                    onClick={() => {
                                        setEditorData(null);
                                    }}
                                >
                                    Reset
                                </Button>
                            </Box>
                        </Grid>
                        {/* <Grid item xs={12}>
                            <Box>
                                <h3 style={{ marginTop: "0px" }}>Question:</h3>
                            </Box>
                            <QuillEditor
                                editorContent={editorContent}
                                handleEditorChange={handleEditorChange}
                            />
                            {formik.touched.question &&
                                formik.errors.question && (
                                    <FormHelperText error>
                                        {formik.errors.question}
                                    </FormHelperText>
                                )}
                            <Box mt={2}>
                                <Button
                                    onClick={() => {
                                        setEditorContent(null);
                                    }}
                                >
                                    Reset
                                </Button>
                            </Box>
                            <Box mt={2}>
                                <h3>Preview:</h3>
                                <div>{editorContent}</div>
                            </Box>
                            <Box mt={2}>
                                <h3>Content:</h3>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: editorContent,
                                    }}
                                />
                            </Box>
                        </Grid> */}
                        {/* <Grid item xs={12}>
                            <Autocomplete
                                multiple
                                freeSolo
                                sx={{
                                    m: 0,
                                }}
                                limitTags={5}
                                options={productTags}
                                getOptionLabel={(option) => option.title}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        variant="outlined"
                                        placeholder={t(
                                            "Select project tags...",
                                        )}
                                    />
                                )}
                            />
                        </Grid> */}
                    </Grid>
                </Card>
            </Grid>
            <Grid item xs={12}>
                {/* <Card
                    sx={{
                        p: 3,
                    }}
                > */}
                <Grid container spacing={3} justifyContent="center">
                    <Grid item>
                        <Box display="flex" gap={10}>
                            {/* <Button
                                // onClick={handleCloseModal}
                                color="secondary"
                            >
                                Cancel
                            </Button> */}
                            <Button
                                type="submit"
                                disabled={formik.isSubmitting}
                                startIcon={
                                    formik.isSubmitting ? (
                                        <CircularProgress size="1rem" />
                                    ) : null
                                }
                                variant="contained"
                            >
                                Submit
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                {/* </Card> */}
            </Grid>
        </>
    );
};

export default MainComponent;

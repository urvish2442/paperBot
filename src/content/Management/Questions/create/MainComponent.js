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
    useTheme,
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

const MainComponent = ({
    formik,
    subjectNames,
    reset,
    setReset,
    answerReset,
    setAnswerReset,
    isEdit = false,
}) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const isMountedRef = useRefMounted();
    const [editorData, setEditorData] = useState(null);

    const [answerData, setAnswerData] = useState(null);
    const { filtersData, currentFilter, subjectFiltersData } =
        useSelector(globalState);
    useEffect(() => {
        if (isEdit) return;
        formik.setValues((preVal) => ({
            ...preVal,
            type: currentFilter.type,
            unit: currentFilter.unit,
        }));
    }, [currentFilter]);

    const currentUnits = useMemo(() => {
        const matchedSubject = subjectFiltersData.find(
            (subject) => subject.model_name === currentFilter.subject,
        );
        return matchedSubject ? matchedSubject.units : [];
    }, [subjectFiltersData, currentFilter.subject]);

    const currentQuestionTypes = useMemo(() => {
        const matchedSubject = subjectFiltersData.find(
            (subject) => subject.model_name === currentFilter.subject,
        );
        return matchedSubject ? matchedSubject.questionTypes : [];
    }, [subjectFiltersData, currentFilter.subject]);

    const handleChange = (event) => {
        const { type, name, value, checked } = event.target;
        const updatedValue = type === "checkbox" ? checked : value;
        dispatch(setCurrentFilter({ [name]: updatedValue }));
        formik.setFieldValue(name, updatedValue);
        if (name === "isFormatted") {
            formik.setFieldValue("question", "");
            setEditorData("");
        }
    };

    useEffect(() => {
        if (isEdit) return;
        formik.setFieldValue("unit", "");
        formik.setFieldValue("type", "");
        dispatch(setCurrentFilter({ unit: "", type: "" }));
    }, [formik.values.subject]);

    const handleSave = (data) => {
        formik.setFieldValue("question", data);
        setEditorData(data);
    };

    // const handleAnswerSave = (data) => {
    //     formik.setFieldValue("answer", data);
    //     setAnswerData(data);
    // };

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
                                        disabled={isEdit}
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
                                                {subject
                                                    .replace("_questions", "")
                                                    .toUpperCase()}
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
                                        {currentQuestionTypes?.map(
                                            (item, index) => (
                                                <MenuItem
                                                    key={index}
                                                    value={item?._id}
                                                >
                                                    {item?.name?.toUpperCase()}
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
                                        {currentUnits?.map(
                                            (unit) =>
                                                unit?.isActive && (
                                                    <MenuItem
                                                        key={unit._id}
                                                        value={unit._id}
                                                    >
                                                        {unit.name}
                                                    </MenuItem>
                                                ),
                                        )}
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
                                {/* <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{ mt: 1 }}
                                >
                                    {t(
                                        "Enable this to format the question text",
                                    )}
                                </Typography> */}
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
                            {/* <Box>
                                <h3 style={{ marginTop: "0px" }}>Question:</h3>
                            </Box> */}
                            <Box>
                                {formik.values.isFormatted ? (
                                    <Editor
                                        onSave={handleSave}
                                        reset={reset}
                                        setReset={setReset}
                                    />
                                ) : (
                                    "" //add mui textarea component here
                                )}
                                {!formik?.values?.isFormatted ? (
                                    <TextField
                                        fullWidth
                                        helperText={
                                            formik.touched.question &&
                                            typeof formik.errors.question ===
                                                "string" &&
                                            formik.errors.question
                                        }
                                        error={Boolean(
                                            formik.touched.question &&
                                                formik.errors.question &&
                                                typeof formik.errors
                                                    .question === "string",
                                        )}
                                        label={t("Question")}
                                        name="question"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={formik.values.question}
                                        variant="outlined"
                                        multiline
                                        rows={4} // You can adjust the number of rows
                                    />
                                ) : (
                                    ""
                                )}
                            </Box>
                            {/* <Box mt={2}>
                                <h3 style={{ marginTop: "0px" }}>
                                    Preview (Question):
                                </h3>
                            </Box> */}
                            {formik?.values?.isFormatted ? (
                                <>
                                    <Box>
                                        <Preview data={editorData} />
                                    </Box>
                                    {formik.touched.question &&
                                    formik.errors.question?.blocks ? (
                                        <FormHelperText error>
                                            {typeof formik.errors?.question
                                                ?.blocks === "string"
                                                ? formik.errors?.question
                                                      ?.blocks
                                                : // Render errors for each block
                                                  formik.errors.question.blocks.map(
                                                      (blockError, index) => {
                                                          if (
                                                              blockError?.data
                                                                  ?.text
                                                          ) {
                                                              // Render error for text field
                                                              return (
                                                                  <div
                                                                      key={
                                                                          index
                                                                      }
                                                                  >
                                                                      Block{" "}
                                                                      {index +
                                                                          1}
                                                                      :{" "}
                                                                      {
                                                                          blockError
                                                                              .data
                                                                              .text
                                                                      }
                                                                  </div>
                                                              );
                                                          } else if (
                                                              blockError?.data
                                                                  ?.items &&
                                                              Array.isArray(
                                                                  blockError
                                                                      .data
                                                                      .items,
                                                              )
                                                          ) {
                                                              // Render error for items if present
                                                              return blockError.data.items.map(
                                                                  (
                                                                      itemError,
                                                                      itemIndex,
                                                                  ) => (
                                                                      <div
                                                                          key={`${index}-${itemIndex}`}
                                                                      >
                                                                          Block{" "}
                                                                          {index +
                                                                              1}
                                                                          , Item{" "}
                                                                          {itemIndex +
                                                                              1}
                                                                          :{" "}
                                                                          {itemError.content ||
                                                                              "Content error"}
                                                                      </div>
                                                                  ),
                                                              );
                                                          } else if (
                                                              typeof blockError?.data ===
                                                              "text"
                                                          ) {
                                                              return (
                                                                  <div
                                                                      key={
                                                                          index
                                                                      }
                                                                  >
                                                                      Block{" "}
                                                                      {index +
                                                                          1}
                                                                      :
                                                                      {
                                                                          blockError?.data
                                                                      }
                                                                  </div>
                                                              );
                                                          }
                                                          return (
                                                              // Fallback for a generic block error
                                                              <div key={index}>
                                                                  Block{" "}
                                                                  {index + 1}:
                                                                  Unknown error
                                                                  in block data
                                                              </div>
                                                          );
                                                      },
                                                  )}
                                        </FormHelperText>
                                    ) : (
                                        ""
                                    )}
                                    <Box mt={2}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {
                                                setEditorData(null);
                                                setReset(true);
                                            }}
                                        >
                                            Reset Question
                                        </Button>
                                    </Box>
                                </>
                            ) : (
                                ""
                            )}
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card
                    sx={{
                        p: 3,
                    }}
                >
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            {/* <Box>
                                <h3 style={{ marginTop: "0px" }}>Answer:</h3>
                            </Box> */}
                            <Box>
                                {/* <Editor
                                        holder="answer"
                                        onSave={handleAnswerSave}
                                        reset={answerReset}
                                        setReset={setAnswerReset}
                                    /> */}
                                <TextField
                                    fullWidth
                                    helperText={
                                        formik.touched.answer &&
                                        typeof formik.errors.answer ===
                                            "string" &&
                                        formik.errors.answer
                                    }
                                    error={Boolean(
                                        formik.touched.answer &&
                                            formik.errors.answer &&
                                            typeof formik.errors.answer ===
                                                "string",
                                    )}
                                    label={t("Answer")}
                                    name="answer"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.answer}
                                    variant="outlined"
                                    multiline
                                    rows={3} // You can adjust the number of rows
                                />
                            </Box>
                            {/* <Box mt={2}>
                                <h3 style={{ marginTop: "0px" }}>
                                    Preview (Answer):
                                </h3>
                            </Box> */}
                            {/* <Box>
                                <Preview data={answerData} type="Answer" />
                            </Box> */}
                            {/* {formik.touched.answer &&
                                formik.errors.answer?.blocks && (
                                    <FormHelperText error>
                                        {typeof formik.errors.answer.blocks ===
                                        "string"
                                            ? formik.errors.answer.blocks
                                            : formik.errors.answer.blocks.map(
                                                  (blockError, index) => {
                                                      if (
                                                          blockError?.data?.text
                                                      ) {
                                                          return (
                                                              <div key={index}>
                                                                  Block{" "}
                                                                  {index + 1}:{" "}
                                                                  {
                                                                      blockError
                                                                          .data
                                                                          .text
                                                                  }
                                                              </div>
                                                          );
                                                      } else if (
                                                          blockError?.data
                                                              ?.items &&
                                                          Array.isArray(
                                                              blockError.data
                                                                  .items,
                                                          )
                                                      ) {
                                                          return blockError.data.items.map(
                                                              (
                                                                  itemError,
                                                                  itemIndex,
                                                              ) => (
                                                                  <div
                                                                      key={`${index}-${itemIndex}`}
                                                                  >
                                                                      Block{" "}
                                                                      {index +
                                                                          1}
                                                                      , Item{" "}
                                                                      {itemIndex +
                                                                          1}
                                                                      :{" "}
                                                                      {itemError.content ||
                                                                          "Content error"}
                                                                  </div>
                                                              ),
                                                          );
                                                      } else if (
                                                          typeof blockError?.data ===
                                                          "text"
                                                      ) {
                                                          return (
                                                              <div key={index}>
                                                                  Block{" "}
                                                                  {index + 1}:
                                                                  {
                                                                      blockError?.data
                                                                  }
                                                              </div>
                                                          );
                                                      }
                                                      return (
                                                          <div key={index}>
                                                              Block {index + 1}:
                                                              Unknown error in
                                                              block data
                                                          </div>
                                                      );
                                                  },
                                              )}
                                    </FormHelperText>
                                )} */}
                            {/* {formik.touched.answer && formik.errors.answer && (
                                <FormHelperText error>
                                    {formik.errors.answer}
                                </FormHelperText>
                            )} */}

                            {/* <Box mt={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        setAnswerData(null);
                                        setAnswerReset(true);
                                    }}
                                >
                                    Reset Answer
                                </Button>
                            </Box> */}
                        </Grid>
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

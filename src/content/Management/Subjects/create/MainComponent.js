"use client";
import React, { useEffect } from "react";
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

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const fullToolbarOptions = [
    // [{ font: [] }], // Font styles
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote", "code-block"], 
    [
        // { list: "ordered" },
        { list: "decimal" },
        { list: "upper-alpha" },
        { list: "lower-alpha" },
        { list: "upper-roman" }, 
        { list: "lower-roman" },
        
    ],
    // [{ indent: "-1" }, { indent: "+1" }],
    // [{ direction: "rtl" }], // Text direction
    [{ align: [] }], // Alignment options
    // ["link", "image", "video"], // Links, images, and videos
    ["clean"], // Clear formatting
];

const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "color",
    "background",
    "script",
    "align",
];

const modules = {
    toolbar: fullToolbarOptions,
};

const EditorWrapper = styled(Box)(
    ({ theme }) => `

    .ql-editor {
      min-height: 100px;
    }

    .ql-snow .ql-picker {
      color: ${theme.colors.alpha.black[100]};
    }

    .ql-snow .ql-stroke {
      stroke: ${theme.colors.alpha.black[100]};
    }

    .ql-toolbar.ql-snow {
      border-top-left-radius: ${theme.general.borderRadius};
      border-top-right-radius: ${theme.general.borderRadius};
    }

    .ql-toolbar.ql-snow,
    .ql-container.ql-snow {
      border-color: ${theme.colors.alpha.black[30]};
    }

    .ql-container.ql-snow {
      border-bottom-left-radius: ${theme.general.borderRadius};
      border-bottom-right-radius: ${theme.general.borderRadius};
    }

    .ql-header .ql-picker-options{
      overflow : auto;
    }

    .ql-editor ol[data-list="upper-alpha"] > li {
        list-style-type: upper-alpha;
    }

    .ql-editor ol[data-list="lower-alpha"] > li {
        list-style-type: lower-alpha;
    }

    .ql-editor ol[data-list="upper-roman"] > li{
        list-style-type: upper-roman;
    }

    .ql-editor ol[data-list="lower-roman"] > li {
        list-style-type: lower-roman;
    }

    .ql-editor ol[data-list="decimal"] > li {
        list-style-type: decimal;
    }

    .ql-editor ol li {
        padding-left: 0px !important;
        counter-reset: none !important;
        counter-increment: none !important;
    }

    .ql-editor ol li:before {
    content: none !important;
}

    &:hover {
      .ql-toolbar.ql-snow,
      .ql-container.ql-snow {
        border-color: ${theme.colors.alpha.black[50]};
      }
    }
`,
);

const productTags = [
    { title: "new" },
    { title: "fresh" },
    { title: "2021" },
    { title: "electronics" },
];

const TabsContainerWrapper = styled(Box)(
    ({ theme }) => `
    background-color: ${theme.colors.alpha.black[5]};
    padding: ${theme.spacing(2)};
  `,
);

const MainComponent = ({ formik, subjectNames }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const isMountedRef = useRefMounted();
    const { filtersData, currentFilter } = useSelector(globalState);
    const [editorContent, setEditorContent] = useState("");


    useEffect(() => {
        const Quill = require("quill");
        const ListItem = Quill.import("formats/list/item");
        const ListFormat = Quill.import("formats/list");

        const CUSTOM_LIST_TYPES = [
            "upper-alpha",
            "lower-alpha",
            "upper-roman",
            "lower-roman",
            "decimal",
        ];

        const getType = {
            decimal: "1",
            "upper-alpha": "A",
            "lower-alpha": "a",
            "upper-roman": "I",
            "lower-roman": "i",
        };

        class CustomListItem extends ListItem {
            static formats(domNode) {
                return domNode.getAttribute("data-list") || null;
            }

            static create(value) {
                const node = super.create();
                if (CUSTOM_LIST_TYPES.includes(value)) {
                    node.setAttribute("data-list", value);
                    node.setAttribute("type", getType[value]);
                }
                return node;
            }
        }
        CustomListItem.blotName = "list-item";
        Quill.register(CustomListItem, true);

        class CustomOrderedList extends ListFormat {
            static formats(domNode) {
                return (
                    domNode.getAttribute("data-list") || super.formats(domNode)
                );
            }

            static create(value) {
                const node = super.create(value);
                if (CUSTOM_LIST_TYPES.includes(value)) {
                    node.setAttribute("data-list", value);
                    node.setAttribute("type", getType[value]);
                }
                return node;
            }
        }
        CustomOrderedList.blotName = "list";
        CustomOrderedList.tagName = "OL";
        Quill.register(CustomOrderedList, true);

        // // Custom Unordered List
        // class CustomUnorderedList extends ListFormat {
        //     static formats(domNode) {
        //         return null; // Unordered lists don't have custom formats
        //     }

        //     static create() {
        //         const node = document.createElement("UL"); // Create a UL element
        //         return node;
        //     }
        // }
        // CustomUnorderedList.blotName = "unordered-list";
        // CustomUnorderedList.tagName = "UL"; // Ensures it's an unordered list
        // Quill.register(CustomUnorderedList, true);
    }, []);

    const updateButtons = () => {
        const buttons = document.querySelectorAll(".ql-list");
        buttons.forEach((button) => {
            switch (button.getAttribute("value")) {
                case "upper-alpha":
                    const iconContainer = document.createElement("span");
                    ReactDOM.render(<AbcTwoToneIcon />, iconContainer);
                    button.appendChild(iconContainer);
                    break;
                case "lower-alpha":
                    button.innerHTML = "abc";
                    break;
                case "upper-roman":
                    button.innerHTML = "I.II.";
                    break;
                case "lower-roman":
                    button.innerHTML = "i.ii.";
                    break;
                case "decimal":
                    button.innerHTML = "123";
                    break;
                default:
                    break;
            }
        });
    };

    useEffect(() => {
        let timer;
        timer = setTimeout(() => {
            updateButtons();
        }, 1000);
        return () => clearTimeout(timer);
    }, [isMountedRef()]);


    const handleEditorChange = (content, delta, source, editor) => {
        setEditorContent(content);
    };

    const handleChange = (event) => {
        const { type, name, value, checked } = event.target;
        const updatedValue = type === "checkbox" ? checked : value;

        dispatch(setCurrentFilter({ [name]: updatedValue }));
        formik.setFieldValue(name, updatedValue);
    };
    return (
        <>
            <Grid item xs={12}>
                <Card>
                    {/* <CardHeader title={t("Subject Information")} />
                    <Divider /> */}
                    <Box p={3}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
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

                            <Grid item xs={12} md={6}>
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
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="title"
                                placeholder={t("Project title here...")}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <EditorWrapper>
                                <ReactQuill
                                    modules={modules}
                                    formats={formats}
                                    value={editorContent}
                                    onChange={handleEditorChange}
                                />
                            </EditorWrapper>
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
                                {/* Render the editor content */}
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: editorContent,
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
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

import {
    Box,
    Button,
    Card,
    Divider,
    InputAdornment,
    TextField,
    useMediaQuery,
    useTheme,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Chip,
    Grid,
} from "@mui/material";
import PageTitleWrapper from "src/components/PageTitleWrapper";

import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { globalState } from "src/redux/slices/global";
import { API_ROUTER } from "src/services/apiRouter";
import { axiosGet } from "src/services/axiosHelper";
import { useEffect, useState, useMemo } from "react";
import QuestionFormatter from "../Questions/QuestionFormatter";
// import { toaster } from "src/utils/toaster";
// import { TOAST_TYPES, TOAST_ALERTS } from "src/constants/toast";
import { LABEL_FOR_STANDARDS } from "src/constants/keywords";

const PaperMain = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down("md"));
    const { subjectQuestionIds } = useSelector(globalState);
    const [paperData, setPaperData] = useState({});
    const [isEditable, setIsEditable] = useState(false);
    // console.log("🚀 ~ PaperMain ~ paperData:", paperData);

    const sortedQuestion = useMemo(() => {
        if (!paperData?.questions || !paperData?.subject?.questionTypes) {
            return {};
        }

        const questionTypes = paperData.subject.questionTypes || [];

        const hasNumber = questionTypes.some(
            (qt) => typeof qt?.number === "number",
        );
        const orderedTypes = hasNumber
            ? [...questionTypes].sort((a, b) => {
                  const aNum =
                      typeof a?.number === "number"
                          ? a.number
                          : Number.MAX_SAFE_INTEGER;
                  const bNum =
                      typeof b?.number === "number"
                          ? b.number
                          : Number.MAX_SAFE_INTEGER;
                  return aNum - bNum;
              })
            : questionTypes;

        const sorted = {};
        orderedTypes.forEach((questionType) => {
            sorted[questionType._id] = paperData.questions.filter(
                (question) => question.type === questionType._id,
            );
        });

        return sorted;
    }, [paperData?.questions, paperData?.subject?.questionTypes]);

    const padWithZero = (number) => {
        return String(number).padStart(2, "0");
    };

    // console.log("🚀 ~ PaperMain ~ sortedQuestion:", sortedQuestion);

    const generatePrintCSS = () => {
        return `
            * {
                box-sizing: border-box;
            }
            
            body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                line-height: 1.6;
                color: #333;
            }
            
            .question-paper-preview {
                width: 210mm !important;
                min-height: 297mm !important;
                margin: 0 auto !important;
                padding: 20mm !important;
                background-color: #ffffff !important;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
                border-radius: 8px !important;
                border: 1px solid #e0e0e0 !important;
            }
            
            @media print {
                .question-paper-preview {
                    width: 100% !important;
                    min-height: auto !important;
                    padding: 20mm !important;
                    box-shadow: none !important;
                    border: none !important;
                }
            }
            
            /* Custom paper header (stable class names) */
            .paper-header {
                text-align: center !important;
                margin-bottom: 4.5px !important;
                border-bottom: 2px solid #333 !important;
                padding-bottom: 4.5px !important;
            }
            .paper-header .trust-name {
                font-size: 14px !important;
                font-weight: 600 !important;
                margin-bottom: 4.5px !important;
                color: #1a1a1a !important;
            }
            .paper-header .school-name {
                font-size: 28px !important;
                font-weight: 800 !important;
                letter-spacing: 0.5px !important;
                color: #1a1a1a !important;
                margin-bottom: 4px !important;
                margin-top: 0 !important;
                line-height: 1.25 !important;
            }
            .paper-meta {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                margin-top: 4px !important;
                gap: 16px !important;
            }
            .paper-meta .left, .paper-meta .right {
                font-weight: 700 !important;
                color: #333 !important;
                font-size: 16px !important;
            }
            .header-separator {
                border-bottom: 2px solid #333 !important;
                margin: 4px 0 0 0 !important;
            }
            .formatted-question p {
                margin: 0 !important;
            }
            .main-section {
                margin-bottom: 4px !important;
            }
            /* Stable classes for question rows (works in print window) */
            .qp-question-row {
                display: flex !important;
                justify-content: space-between !important;
                align-items: flex-start !important;
                margin-bottom: 0px !important;
            }
            .qp-qno {
                font-weight: bold !important;
                font-size: 16px !important;
                color: #1a1a1a !important;
                min-width: 60px !important;
                margin-right: 8px !important;
            }
            .qp-qtext {
                flex: 1 !important;
                font-size: 15px !important;
                line-height: 1.6 !important;
                color: #333 !important;
            }
            .qp-qtext p { margin: 0 !important; padding: 0 !important; }
            .qp-qmarks {
                font-weight: bold !important;
                font-size: 14px !important;
                color: #666 !important;
                margin-left: 8px !important;
                min-width: 40px !important;
                text-align: right !important;
                white-space: nowrap !important;
            }
            
            /* Header Styles */
            .css-gk1sko {
                text-align: center !important;
                margin-bottom: 30px !important;
                border-bottom: 2px solid #333 !important;
                padding-bottom: 20px !important;
            }
            
            /* Header Title */
            .css-1x32eg9-MuiTypography-root {
                font-size: 28px !important;
                font-weight: bold !important;
                margin-bottom: 10px !important;
                color: #1a1a1a !important;
            }
            
            /* Time and Marks Container */
            .css-n9btsa {
                display: flex !important;
                justify-content: center !important;
                gap: 32px !important;
                margin-top: 16px !important;
            }
            
            /* Time and Marks Text */
            .css-1jiljnr-MuiTypography-root {
                font-weight: bold !important;
                color: #333 !important;
                font-size: 16px !important;
            }
            
            /* Instructions Box */
            .css-tkplri {
                margin-bottom: 30px !important;
                padding: 24px !important;
                background: #f8f9fa !important;
                border-radius: 4px !important;
                border: 1px solid #dee2e6 !important;
            }
            
            /* Instructions Title */
            .css-15qf0oe-MuiTypography-root {
                font-weight: bold !important;
                margin-bottom: 16px !important;
                color: #495057 !important;
                font-size: 18px !important;
            }
            
            /* Instructions List */
            .css-1ygbl0l-MuiList-root {
                padding: 0 !important;
            }
            
            .css-f89oon-MuiListItem-root {
                padding: 4px 0 !important;
            }
            
            .css-13wq8fk-MuiTypography-root {
                font-size: 14px !important;
                color: #495057 !important;
                line-height: 1.5 !important;
            }
            
            /* Section Container */
            .css-olj9g3 {
                margin-bottom: 40px !important;
                page-break-inside: avoid !important;
            }
            
            /* Section Headers */
            .css-1jcowt9-MuiTypography-root {
                margin-bottom: 20px !important;
                font-weight: bold !important;
                font-size: 20px !important;
                color: #1a1a1a !important;
                border-bottom: 2px solid #333 !important;
                padding-bottom: 8px !important;
            }
            
            /* Questions Container */
            .css-1h1tnhe {
                padding-left: 16px !important;
            }
            
            /* Individual Question Container */
            .css-jx397n {
                margin-bottom: 24px !important;
                padding: 0 !important;
                border: none !important;
                background-color: transparent !important;
            }
            
            /* Question Layout */
            .css-avjk9y {
                display: flex !important;
                justify-content: space-between !important;
                align-items: flex-start !important;
                margin-bottom: 16px !important;
            }
            
            /* Question Number */
            .css-1h7hkij-MuiTypography-root {
                font-weight: bold !important;
                font-size: 16px !important;
                color: #1a1a1a !important;
                min-width: 60px !important;
            }
            
            /* Question Text */
            .css-12193vx-MuiTypography-root {
                flex: 1 !important;
                font-size: 15px !important;
                line-height: 1.6 !important;
                color: #333 !important;
            }
            
            /* Question Text Paragraph */
            .css-12193vx-MuiTypography-root p {
                margin: 0 !important;
                padding: 0 !important;
            }
            
            /* Marks Display */
            .css-123rhdl-MuiTypography-root {
                font-weight: bold !important;
                font-size: 14px !important;
                color: #666 !important;
                margin-left: 16px !important;
                min-width: 40px !important;
                text-align: right !important;
            }
            
            /* Print Specific Styles */
            @media print {
                body { 
                    margin: 0 !important; 
                    padding: 20px !important;
                }
                .no-print { 
                    display: none !important; 
                }
                .css-jx397n { 
                    page-break-inside: avoid !important; 
                }
                .css-olj9g3 { 
                    page-break-inside: avoid !important; 
                }
            }
        `;
    };

    const handlePrint = () => {
        const printContent = document.getElementById("question-paper-preview");
        if (!printContent) return;

        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Question Paper - ${
                        paperData?.subject?.model_name || "Subject"
                    }</title>
                    <style>
                        ${generatePrintCSS()}
                    </style>
                </head>
                <body>
                    <div class="question-paper-preview">
                        ${printContent.innerHTML}
                    </div>
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };

    const handleDownload = () => {
        const printContent = document.getElementById("question-paper-preview");
        if (!printContent) return;

        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Question Paper - ${
                        paperData?.subject?.model_name || "Subject"
                    }</title>
                    <style>
                        ${generatePrintCSS()}
                    </style>
                </head>
                <body>
                    <div class="question-paper-preview">
                        ${printContent.innerHTML}
                    </div>
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        // For download, we'll just open the window and let user save as PDF
        // The user can use browser's "Save as PDF" option
    };

    const getData = async () => {
        try {
            const { data, status, message } = await axiosGet(
                API_ROUTER.GET_QUESTION_BY_ID_AND_SUBJECT(
                    subjectQuestionIds?.subject,
                    JSON.stringify(subjectQuestionIds?.ids),
                ),
            );
            if (status) {
                setPaperData(data);
            } else {
                // toaster(
                //     TOAST_TYPES.ERROR,
                //     message || TOAST_ALERTS.GENERAL_ERROR,
                // );
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditable = () => {
        setIsEditable(!isEditable);
    };

    useEffect(() => {
        if (
            !subjectQuestionIds?.subject ||
            subjectQuestionIds?.ids?.length == 0
        )
            return;
        getData();
    }, [subjectQuestionIds]);

    return (
        <>
            <PageTitleWrapper>
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Grid item>
                        <Typography variant="h3" component="h3" gutterBottom>
                            Question Paper Preview{" "}
                            {!paperData?.subject?.model_name ? (
                                ""
                            ) : (
                                <Typography component="span" variant="h5">
                                    (
                                    {paperData?.subject?.model_name?.toUpperCase()}
                                    )
                                </Typography>
                            )}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Button
                                sx={{
                                    mt: { xs: 2, sm: 0 },
                                }}
                                variant="outlined"
                                startIcon={<PrintIcon />}
                                onClick={handlePrint}
                                disabled={isEditable}
                            >
                                {t("Print")}
                            </Button>
                            {/* <Button
                                sx={{
                                    mt: { xs: 2, sm: 0 },
                                }}
                                variant="contained"
                                startIcon={<DownloadIcon />}
                                onClick={handleDownload}
                            >
                                {t("Download")}
                            </Button> */}
                            <Button
                                sx={{
                                    mt: { xs: 2, sm: 0 },
                                }}
                                variant="contained"
                                onClick={handleEditable}
                            >
                                {isEditable ? t("Save") : t("Edit")}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </PageTitleWrapper>

            <Grid
                sx={{ px: 4 }}
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                spacing={3}
            >
                {/* <Grid item xs={12}>
                    <Card>
                        <Box display="flex" alignItems="center">
                            <Box
                                flex={1}
                                p={2}
                                display={{ xs: "block", md: "flex" }}
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Box
                                    sx={{
                                        mb: { xs: 2, md: 0 },
                                    }}
                                >
                                    <TextField
                                        size="small"
                                        fullWidth={mobile}
                                        // onChange={handleQueryChange}
                                        // value={payload?.search || ""}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchTwoToneIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                        placeholder={t(
                                            "Search by product name...",
                                        )}
                                    />
                                </Box>
                            </Box>
                        </Box>
                        <Divider />
                    </Card>
                </Grid> */}

                {/* Question Paper Preview */}
                <Grid item xs={12}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                        }}
                    >
                        <Paper
                            id="question-paper-preview"
                            sx={{
                                width: "210mm", // A4 width
                                minHeight: "297mm", // A4 height
                                p: "20mm", // A4 margins
                                backgroundColor: "#ffffff",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                borderRadius: "8px",
                                border: "1px solid #e0e0e0",
                                "@media print": {
                                    boxShadow: "none",
                                    border: "none",
                                    width: "100%",
                                    minHeight: "auto",
                                    p: "20mm",
                                },
                                "@media screen and (max-width: 768px)": {
                                    width: "100%",
                                    minHeight: "auto",
                                    p: "16px",
                                },
                            }}
                        >
                            {/* Header */}
                            <Box
                                id="question-paper-preview-header"
                                className="paper-header"
                                sx={{
                                    textAlign: "center",
                                    mb: 0.5,
                                    borderBottom: "2px solid #333",
                                    pb: 0.5,
                                }}
                            >
                                {/* Trust Name */}
                                <Typography
                                    className="trust-name"
                                    variant="body2"
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: 14,
                                        color: "#1a1a1a",
                                        mb: 0.5,
                                    }}
                                    contentEditable={isEditable}
                                >
                                    Shri Sardar Patel Girls Education Trust -
                                    Managed
                                </Typography>

                                {/* School Name */}
                                <Typography
                                    className="school-name"
                                    variant="h4"
                                    component="h1"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: 28,
                                        color: "#1a1a1a",
                                    }}
                                    contentEditable={isEditable}
                                >
                                    Shri Kanya Vidyalaya - Rajkot
                                </Typography>

                                {/* Separator line */}
                                <Box
                                    className="header-separator"
                                    sx={{
                                        borderBottom: "2px solid #333",
                                        mt: 0.5,
                                        // mb: 1,
                                    }}
                                />

                                {/* Meta Row 1: Standard | Total Marks */}
                                <Box
                                    className="paper-meta"
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mt: 0.5,
                                    }}
                                >
                                    <Typography
                                        className="left"
                                        variant="h6"
                                        sx={{
                                            fontWeight: "bold",
                                            color: "#333",
                                            fontSize: 16,
                                        }}
                                        contentEditable={isEditable}
                                    >
                                        Standard:{" "}
                                        {LABEL_FOR_STANDARDS[
                                            paperData?.subject?.standard
                                        ] ||
                                            paperData?.subject?.standard ||
                                            "-"}
                                    </Typography>
                                    <Typography
                                        className="right"
                                        variant="h6"
                                        sx={{
                                            fontWeight: "bold",
                                            color: "#333",
                                            fontSize: 16,
                                        }}
                                        contentEditable={isEditable}
                                    >
                                        Total Marks:{" "}
                                        {paperData?.questions?.reduce(
                                            (sum, q) => sum + (q.marks || 0),
                                            0,
                                        ) || 0}
                                    </Typography>
                                </Box>

                                {/* Meta Row 2: Subject | Time */}
                                <Box
                                    className="paper-meta"
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mt: 0.5,
                                    }}
                                >
                                    <Typography
                                        className="left"
                                        variant="h6"
                                        sx={{
                                            fontWeight: "bold",
                                            color: "#333",
                                            fontSize: 16,
                                        }}
                                        contentEditable={isEditable}
                                    >
                                        Subject:{" "}
                                        {paperData?.subject?.name ||
                                            (paperData?.subject?.model_name
                                                ? paperData?.subject?.model_name.replace(
                                                      /_/g,
                                                      " ",
                                                  )
                                                : "Subject")}
                                    </Typography>
                                    <Typography
                                        className="right"
                                        variant="h6"
                                        sx={{
                                            fontWeight: "bold",
                                            color: "#333",
                                            fontSize: 16,
                                        }}
                                        contentEditable={isEditable}
                                    >
                                        Time:{" "}
                                        {paperData?.subject?.duration || "3"}{" "}
                                        Hours
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Instructions */}
                            {/* <Box
                            sx={{
                                mb: 4,
                                p: 3,
                                bgcolor: "#f8f9fa",
                                borderRadius: 1,
                                border: "1px solid #dee2e6",
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: "bold",
                                    mb: 2,
                                    color: "#495057",
                                }}
                            >
                                Instructions:
                            </Typography>
                            <List dense sx={{ py: 0 }}>
                                <ListItem sx={{ py: 0.5 }}>
                                    <ListItemText
                                        primary="1) Write in a clear legible handwriting."
                                        sx={{
                                            "& .MuiListItemText-primary": {
                                                fontSize: "14px",
                                                color: "#495057",
                                            },
                                        }}
                                    />
                                </ListItem>
                                <ListItem sx={{ py: 0.5 }}>
                                    <ListItemText
                                        primary={`2) This question paper has ${
                                            Object.keys(sortedQuestion).length
                                        } Sections and Question Numbers from 1 to ${
                                            paperData?.questions?.length || 0
                                        }.`}
                                        sx={{
                                            "& .MuiListItemText-primary": {
                                                fontSize: "14px",
                                                color: "#495057",
                                            },
                                        }}
                                    />
                                </ListItem>
                                <ListItem sx={{ py: 0.5 }}>
                                    <ListItemText
                                        primary="3) All questions are compulsory. There are only internal options."
                                        sx={{
                                            "& .MuiListItemText-primary": {
                                                fontSize: "14px",
                                                color: "#495057",
                                            },
                                        }}
                                    />
                                </ListItem>
                                <ListItem sx={{ py: 0.5 }}>
                                    <ListItemText
                                        primary="4) The numbers to the right represent the marks of the question."
                                        sx={{
                                            "& .MuiListItemText-primary": {
                                                fontSize: "14px",
                                                color: "#495057",
                                            },
                                        }}
                                    />
                                </ListItem>
                                <ListItem sx={{ py: 0.5 }}>
                                    <ListItemText
                                        primary="5) Draw neat diagrams wherever necessary."
                                        sx={{
                                            "& .MuiListItemText-primary": {
                                                fontSize: "14px",
                                                color: "#495057",
                                            },
                                        }}
                                    />
                                </ListItem>
                                <ListItem sx={{ py: 0.5 }}>
                                    <ListItemText
                                        primary="6) New sections should be written in a new page. Write the answers in numerical order."
                                        sx={{
                                            "& .MuiListItemText-primary": {
                                                fontSize: "14px",
                                                color: "#495057",
                                            },
                                        }}
                                    />
                                </ListItem>
                            </List>
                        </Box> */}

                            {/* Questions by Type */}
                            {Object.entries(sortedQuestion).map(
                                ([questionTypeId, questions], typeIndex) => {
                                    const questionType =
                                        paperData?.subject?.questionTypes?.find(
                                            (type) =>
                                                type._id === questionTypeId,
                                        );

                                    if (!questions || questions.length === 0)
                                        return null;

                                    return (
                                        <Box
                                            key={questionTypeId}
                                            sx={{
                                                mb: 0.5,
                                                pageBreakBefore: "always",
                                            }}
                                            className="main-section"
                                        >
                                            {/* Section label only with underline */}
                                            <div
                                                style={{
                                                    textAlign: "center",
                                                    margin: "4px 0",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontWeight: 700,
                                                        textTransform:
                                                            "uppercase",
                                                        textDecoration:
                                                            "underline",
                                                    }}
                                                >
                                                    Section:{" "}
                                                    {String.fromCharCode(
                                                        65 + typeIndex,
                                                    )}
                                                </span>
                                            </div>

                                            {/* Description row: plain HTML */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                    marginBottom: 4,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            width: 6,
                                                            height: 6,
                                                            background: "#000",
                                                            borderRadius: "50%",
                                                            display:
                                                                "inline-block",
                                                            marginRight: 12,
                                                        }}
                                                    ></span>
                                                    <strong>
                                                        {questionType?.description ||
                                                            "Questions"}
                                                    </strong>
                                                </div>
                                                <strong>
                                                    (
                                                    {padWithZero(
                                                        questions?.reduce(
                                                            (sum, q) =>
                                                                sum +
                                                                (q.marks || 0),
                                                            0,
                                                        ) || 0,
                                                    )}
                                                    )
                                                </strong>
                                            </div>

                                            <Box sx={{ pl: 2 }}>
                                                {questions.map(
                                                    (question, index) => (
                                                        <Box
                                                            key={question._id}
                                                            sx={{
                                                                mb: 0.5,
                                                                p: 0,
                                                                border: "none",
                                                                backgroundColor:
                                                                    "transparent",
                                                            }}
                                                        >
                                                            <div
                                                                className="qp-question-row"
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    justifyContent:
                                                                        "space-between",
                                                                    alignItems:
                                                                        "flex-start",
                                                                    marginBottom: 0,
                                                                }}
                                                            >
                                                                <span
                                                                    className="qp-qno"
                                                                    style={{
                                                                        fontWeight:
                                                                            "bold",
                                                                        fontSize:
                                                                            "16px",
                                                                        color: "#1a1a1a",
                                                                        minWidth:
                                                                            "60px",
                                                                        marginRight: 8,
                                                                    }}
                                                                >
                                                                    Q{index + 1}
                                                                    .
                                                                </span>
                                                                <div
                                                                    className={`qp-qtext ${
                                                                        question.isFormatted
                                                                            ? "formatted-question"
                                                                            : ""
                                                                    }`}
                                                                    style={{
                                                                        flex: 1,
                                                                        fontSize:
                                                                            "15px",
                                                                        lineHeight: 1.6,
                                                                        color: "#333",
                                                                    }}
                                                                >
                                                                    {question.isFormatted ? (
                                                                        <QuestionFormatter
                                                                            data={
                                                                                question.question
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        question.question
                                                                    )}
                                                                </div>
                                                                {/* <span className="qp-qmarks">[{question.marks || 0} marks]</span> */}
                                                            </div>
                                                        </Box>
                                                    ),
                                                )}
                                            </Box>
                                        </Box>
                                    );
                                },
                            )}

                            {Object.keys(sortedQuestion).length === 0 && (
                                <Box sx={{ textAlign: "center", py: 8 }}>
                                    <Typography
                                        variant="h6"
                                        color="text.secondary"
                                    >
                                        No questions selected for preview
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Please select questions from the
                                        question bank to generate the paper
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default PaperMain;

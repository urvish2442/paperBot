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
    CircularProgress,
} from "@mui/material";
import PageTitleWrapper from "src/components/PageTitleWrapper";

import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { globalState, setPaperId } from "src/redux/slices/global";
import { API_ROUTER } from "src/services/apiRouter";
import { axiosGet } from "src/services/axiosHelper";
import { useEffect, useState, useMemo, useCallback } from "react";
import QuestionFormatter from "../Questions/QuestionFormatter";
// import { TOAST_TYPES, TOAST_ALERTS } from "src/constants/toast";
import {
    LABEL_FOR_STANDARDS,
    NUMBERED_STANDARDS,
} from "src/constants/keywords";
import { GeneratePrintCSS } from "./cssHelper";
import { useDispatch } from "react-redux";
import useToaster from "src/hooks/useToaster";
import EditHeaderModal from "./EditHeaderModal";
const html2pdfPromise = import("html2pdf.js").then((m) => m.default);

//** Helper Functions */
const padWithZero = (number) => {
    return String(number).padStart(2, "0");
};

const toProperCase = (str) => {
    if (!str) {
        return ""; // Handle empty or null strings
    }
    const lowerCaseStr = str.toLowerCase();
    return lowerCaseStr.charAt(0).toUpperCase() + lowerCaseStr.slice(1);
};

const PaperMain = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down("md"));
    const { subjectQuestionIds, paperId } = useSelector(globalState);
    const dispatch = useDispatch();
    const [paperData, setPaperData] = useState({});
    const { toaster } = useToaster();
    const [openHeaderModal, setOpenHeaderModal] = useState(false);
    const [isHeaderSubmitting, setIsHeaderSubmitting] = useState(false);
    const [headerData, setHeaderData] = useState({
        trustName: "Shri Sardar Patel Girls Education Trust - Managed",
        schoolName: "Shri Kanya Vidyalaya - Rajkot",
        hours: "3 Hours",
        marks: 0,
    });

    const SubjectName = useMemo(() => {
        const subjectName =
            paperData?.subject?.name || paperData?.subject?.model_name || "";

        const finalName = subjectName.includes("_")
            ? subjectName.split("_").pop()
            : subjectName;
        return toProperCase(finalName);
    }, [paperData?.subject?.name, paperData?.subject?.model_name]);

    const sortedQuestions = useMemo(() => {
        if (!paperData?.questions || !paperData?.subject?.questionTypes) {
            return {};
        }

        const questionTypes = paperData.subject.questionTypes || [];

        // group types by section
        const sectionMap = {};
        questionTypes.forEach((qt) => {
            const section = qt.section || "Other";
            if (!sectionMap[section]) {
                sectionMap[section] = [];
            }
            sectionMap[section].push(qt);
        });

        // sort sections alphabetically
        const sortedSections = Object.keys(sectionMap).sort();

        const result = {};
        sortedSections.forEach((section) => {
            // sort types inside section by "number"
            const orderedTypes = sectionMap[section].sort((a, b) => {
                const aNum =
                    typeof a?.number === "number"
                        ? a.number
                        : Number.MAX_SAFE_INTEGER;
                const bNum =
                    typeof b?.number === "number"
                        ? b.number
                        : Number.MAX_SAFE_INTEGER;
                return aNum - bNum;
            });

            const typeMap = {};
            orderedTypes.forEach((qt) => {
                const qs = paperData.questions.filter((q) => q.type === qt._id);
                if (qs.length > 0) {
                    typeMap[qt._id] = qs;
                }
            });

            if (Object.keys(typeMap).length > 0) {
                result[section] = typeMap; // add section only if it has at least one qt
            }
        });

        return result;
    }, [paperData?.questions, paperData?.subject?.questionTypes]);

    console.log("sortedQuestions", sortedQuestions);

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
                    ${GeneratePrintCSS()}

                    @page {
                        margin: 0; /* Removes browser default margins */
                    }

                    @media print {
                        // body, .question-paper-preview {
                        //     margin: 0 !important;
                        //     padding: 0 !important;
                        // }
                        /* Force Chrome to not print headers/footers */
                        @page {
                            size: A4;  /* You can change to letter if needed */
                            margin: 0; /* Ensures no extra margins */
                        }
                    }
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
    printWindow.print();
};

    const [loading, setLoading] = useState(true);
    const getData = async () => {
        setLoading(true);
        try {
            // questionIds=${ids}
            const queryString = !paperId
                ? `questionIds=${JSON.stringify(subjectQuestionIds?.ids)}`
                : `paperId=${paperId}`;
            const { data, status, message } = await axiosGet(
                API_ROUTER.GET_QUESTION_BY_ID_AND_SUBJECT(
                    subjectQuestionIds?.subject,
                    queryString,
                ),
            );
            if (status) {
                setPaperData(data || {});
                if (!paperId) {
                    dispatch(setPaperId(data?.paperId));
                }
            } else {
                toaster(
                    TOAST_TYPES.ERROR,
                    message || TOAST_ALERTS.GENERAL_ERROR,
                );
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (
            !subjectQuestionIds?.subject ||
            subjectQuestionIds?.ids?.length == 0
        )
            return;
        getData();
    }, [subjectQuestionIds]);

    const totalMarks = useMemo(() => {
        if (!paperData?.questions || paperData.questions.length === 0) return 0;

        return (
            paperData?.questions?.reduce((sum, q) => sum + (q.marks || 0), 0) ||
            0
        );
    }, [paperData?.questions]);

    useEffect(() => {
        setHeaderData((prev) => ({
            ...prev,
            marks: totalMarks,
        }));
    }, [totalMarks]);

    const handleOpenHeaderModal = useCallback(
        () => setOpenHeaderModal(true),
        [],
    );
    const handleCloseHeaderModal = useCallback(
        () => setOpenHeaderModal(false),
        [],
    );

    const handleHeaderSave = (newHeader) => {
        setIsHeaderSubmitting(true);
        setHeaderData(newHeader);
        setIsHeaderSubmitting(false);
        setOpenHeaderModal(false);
    };

    useEffect(() => {
        if (paperData?.paperId || !paperId) return;
        getData();
    }, [paperId, paperData?.paperId]);

    let questionCounter = 1;

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
                                disabled={openHeaderModal}
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
                                onClick={handleOpenHeaderModal}
                            >
                                {t("Edit")}
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
                                p: "10mm", // A4 margins
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
                            {/* loader */}
                            {!loading ? (
                                <>
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
                                        >
                                            {headerData?.trustName || ""}
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
                                        >
                                            {headerData?.schoolName || ""}
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
                                            >
                                                Standard:{" "}
                                                <span>
                                                    {NUMBERED_STANDARDS[
                                                        paperData?.subject
                                                            ?.standard
                                                    ] ||
                                                        paperData?.subject
                                                            ?.standard ||
                                                        "-"}
                                                </span>
                                            </Typography>
                                            <Typography
                                                className="right"
                                                variant="h6"
                                                sx={{
                                                    fontWeight: "bold",
                                                    color: "#333",
                                                    fontSize: 16,
                                                }}
                                            >
                                                Total Marks:{" "}
                                                {headerData?.marks || 0}
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
                                            >
                                                Subject: {SubjectName || ""}
                                            </Typography>
                                            <Typography
                                                className="right"
                                                variant="h6"
                                                sx={{
                                                    fontWeight: "bold",
                                                    color: "#333",
                                                    fontSize: 16,
                                                }}
                                            >
                                                Time: {headerData?.hours}
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

                                    {Object.entries(sortedQuestions).map(
                                        ([section, types], sectionIndex) => {
                                            // skip empty sections
                                            const typeIds = Object.keys(types);
                                            if (typeIds.length === 0)
                                                return null;

                                            return (
                                                <Box
                                                    key={section}
                                                    sx={{
                                                        mb: 0.5,
                                                        pageBreakBefore:
                                                            "always",
                                                    }}
                                                    className="main-section"
                                                >
                                                    {/* Section label */}
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
                                                            Section: {section}
                                                        </span>
                                                    </div>

                                                    {Object.entries(types).map(
                                                        ([
                                                            questionTypeId,
                                                            questions,
                                                        ]) => {
                                                            const questionType =
                                                                paperData?.subject?.questionTypes?.find(
                                                                    (type) =>
                                                                        type._id ===
                                                                        questionTypeId,
                                                                );

                                                            if (
                                                                !questions ||
                                                                questions.length ===
                                                                    0
                                                            )
                                                                return null;

                                                            return (
                                                                <Box
                                                                    key={
                                                                        questionTypeId
                                                                    }
                                                                    sx={{
                                                                        mb: 1,
                                                                    }}
                                                                    className="type-block"
                                                                >
                                                                    {/* Description row */}
                                                                    <div
                                                                        style={{
                                                                            display:
                                                                                "flex",
                                                                            justifyContent:
                                                                                "space-between",
                                                                            alignItems:
                                                                                "center",
                                                                            marginBottom: 0,
                                                                        }}
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                display:
                                                                                    "flex",
                                                                                alignItems:
                                                                                    "center",
                                                                            }}
                                                                        >
                                                                            <span
                                                                                style={{
                                                                                    width: 6,
                                                                                    height: 6,
                                                                                    background:
                                                                                        "#000",
                                                                                    borderRadius:
                                                                                        "50%",
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
                                                                                    (
                                                                                        sum,
                                                                                        q,
                                                                                    ) =>
                                                                                        sum +
                                                                                        (q.marks ||
                                                                                            0),
                                                                                    0,
                                                                                ) ||
                                                                                    0,
                                                                            )}
                                                                            )
                                                                        </strong>
                                                                    </div>

                                                                    <Box
                                                                        sx={{
                                                                            pl: 2,
                                                                        }}
                                                                    >
                                                                        {questions.map(
                                                                            (
                                                                                question,
                                                                            ) => (
                                                                                <Box
                                                                                    key={
                                                                                        question._id
                                                                                    }
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
                                                                                                // fontWeight:
                                                                                                //     "bold",
                                                                                                // fontSize:
                                                                                                //     "15px",
                                                                                                // color: "#1a1a1a",
                                                                                                minWidth:
                                                                                                    "25px",
                                                                                                marginRight: 4,
                                                                                            }}
                                                                                        >
                                                                                            <strong>
                                                                                                {
                                                                                                    questionCounter++
                                                                                                }

                                                                                                .
                                                                                            </strong>
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
                                                                                    </div>
                                                                                </Box>
                                                                            ),
                                                                        )}
                                                                    </Box>
                                                                </Box>
                                                            );
                                                        },
                                                    )}
                                                </Box>
                                            );
                                        },
                                    )}

                                    {Object.keys(sortedQuestions).length ===
                                        0 && (
                                        <Box
                                            sx={{ textAlign: "center", py: 8 }}
                                        >
                                            <Typography
                                                variant="h6"
                                                color="text.secondary"
                                            >
                                                No questions selected for
                                                preview
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Please select questions from the
                                                question bank to generate the
                                                paper
                                            </Typography>
                                        </Box>
                                    )}

                                    <EditHeaderModal
                                        open={openHeaderModal}
                                        handleClose={handleCloseHeaderModal}
                                        headerData={headerData}
                                        setHeaderData={setHeaderData}
                                        onSave={handleHeaderSave}
                                        isSubmitting={isHeaderSubmitting}
                                    />
                                </>
                            ) : (
                                <Box sx={{ textAlign: "center", py: 8 }}>
                                    <CircularProgress />
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

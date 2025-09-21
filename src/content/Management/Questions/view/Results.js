import React, { useState } from "react";
import { useMemo, useCallback } from "react";

import {
    Box,
    Card,
    Checkbox,
    Divider,
    Tooltip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableContainer,
    TableRow,
    Button,
    Typography,
    Dialog,
    useMediaQuery,
    useTheme,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    DialogContent,
    Grid,
    DialogTitle,
    DialogActions,
    CircularProgress,
    Fab,
} from "@mui/material";
import PreviewIcon from "@mui/icons-material/Visibility"; // Add this import for a preview icon
import CloseIcon from "@mui/icons-material/Close";

import { useTranslation } from "react-i18next";
import Text from "src/components/Text";
import ListTwoToneIcon from "@mui/icons-material/ListTwoTone";

import { useSubjectQuestions } from "src/hooks/useFetchHooks";
import QuestionFormatter from "../QuestionFormatter";
import { useSelector } from "react-redux";
import { globalState } from "src/redux/slices/global";
import { useInView } from "react-intersection-observer";
import { styled } from "@mui/material/styles";

const DialogWrapper = styled(Dialog)(
    () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`,
);

// Styled Avatar for info icon (use primary color for generate)
const AvatarInfo = styled("div")(({ theme }) => ({
    background: theme.palette.primary.lighter || "#e3f2fd",
    color: theme.palette.primary.main,
    width: theme.spacing(8),
    height: theme.spacing(8),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    marginBottom: theme.spacing(2),
    fontSize: 32,
}));

const Results = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down("md"));
    const { filtersData, subjectFiltersData, currentFilter } =
        useSelector(globalState);
    const [totalSelectedMarks, setTotalSelectedMarks] = useState(0);

    const SUBJECTS_TABLE_HEADERS = [
        { value: "id", label: "Select", isSortable: false },
        { value: "question", label: "Question", isSortable: true },
        { value: "marks", label: "Marks", isSortable: true, align: "center" },
        { value: "type", label: "Type", isSortable: false, align: "center" },
        { value: "unit", label: "Unit", isSortable: false },
        {
            value: "actions",
            label: "Actions",
            align: "center",
            isSortable: false,
        },
    ];

    const {
        items: questions,
        loading: isLoading,
        page,
        limit,
        payload,
        count,
        hasMore,
        currentItem,
        handleOpenModal,
        handleCloseModal,
        handlePageChange,
        handleFilterChange,
        handleSort,
        subject,
        selectedQuestions,
        setSelectedQuestions,
        handleAddQuestionIds,
    } = useSubjectQuestions();

    const { ref: viewRef, inView } = useInView({
        threshold: 0.5,
    });

    useMemo(() => {
        if (inView && hasMore) {
            handlePageChange();
        }
    }, [inView, hasMore]);

    const isFirstPageLoading = useMemo(() => {
        return isLoading && page === 1;
    }, [isLoading, page]);

    const currentUnits = useMemo(() => {
        const matchedSubject = subjectFiltersData.find((sub) => {
            return sub.model_name === subject;
        });
        return matchedSubject ? matchedSubject.units : [];
    }, [subjectFiltersData, subject]);

    const currentQuestionTypes = useMemo(() => {
        const matchedSubject = subjectFiltersData.find(
            (sub) => sub.model_name === subject,
        );
        return matchedSubject ? matchedSubject.questionTypes : [];
    }, [subjectFiltersData, subject]);

    const getUnitName = useCallback(
        (unitId) => {
            if (!unitId) return "";
            const matchedUnit = currentUnits.find(
                (unit) => unit._id === unitId,
            );
            if (!matchedUnit) return "";
            const textColor = matchedUnit?.isActive ? "primary" : "error";

            return (
                <Text
                    color={textColor}
                >{`${matchedUnit.number}: ${matchedUnit.name}`}</Text>
            );
        },
        [currentUnits],
    );

    const getQuestionTypeName = useCallback(
        (questionTypeId) => {
            if (!questionTypeId) return "";
            const matchedType = currentQuestionTypes.find(
                (type) => type._id === questionTypeId,
            );
            return <Text>{matchedType?.name || ""}</Text>;
        },
        [currentQuestionTypes],
    );

    const handleSelectQuestions = (id) => {
        setSelectedQuestions((preVal) => {
            if (preVal?.includes(id)) {
                setTotalSelectedMarks(
                    totalSelectedMarks -
                        Number(questions.find((q) => q._id === id)?.marks),
                );
                return preVal?.filter((item) => item !== id);
            } else {
                setTotalSelectedMarks(
                    totalSelectedMarks +
                        Number(questions.find((q) => q._id === id)?.marks),
                );
                return [...preVal, id];
            }
        });
    };

    const [openConfirmGenerate, setOpenConfirmGenerate] = useState(false);

    const toggleOpenConfirmGenerate = () =>
        setOpenConfirmGenerate(!openConfirmGenerate);

    const handleGeneratePaper = () => {
        if (selectedQuestions.length === 0) return;
        setOpenConfirmGenerate(false);
        handleAddQuestionIds();
    };

    return (
        <>
            {/* <Grid item xs={12}>
                <Card>
                    <CardHeader title={t("Subject Information")} />
                    <Divider />
                </Card>
            </Grid> */}
            <Card>
                <Box p={3}>
                    <Grid container spacing={3}>
                        {/* <Grid item xs={12} md={4}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel id="subject-label">
                                    Subject
                                </InputLabel>
                                <Select
                                    labelId="subject-label"
                                    id="subject-select"
                                    value={payload.subject || ""}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "subject",
                                            e.target.value,
                                        )
                                    }
                                    label="Subject"
                                    disabled={isLoading}
                                >
                                    {subjectNames.map((subject) => (
                                        <MenuItem key={subject} value={subject}>
                                            {subject.toUpperCase()}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid> */}

                        <Grid item xs={12} md={5}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel id="type-label">Type</InputLabel>
                                <Select
                                    labelId="type-label"
                                    id="type-select"
                                    value={
                                        payload.type === null
                                            ? "all"
                                            : payload.type
                                    }
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "type",
                                            e.target.value,
                                        )
                                    }
                                    label="type"
                                    disabled={isLoading}
                                >
                                    <MenuItem value="all">
                                        <em>All</em>
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
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} md={5}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel id="unit-label">Unit</InputLabel>
                                <Select
                                    labelId="unit-label"
                                    id="unit-select"
                                    value={
                                        payload.unit === null
                                            ? "all"
                                            : payload.unit
                                    }
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "unit",
                                            e.target.value,
                                        )
                                    }
                                    label="unit"
                                    disabled={isLoading}
                                >
                                    <MenuItem value="all">
                                        <em>All</em>
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
                            </FormControl>
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            md={2}
                            sx={{ display: "flex", alignItems: "flex-end" }}
                        >
                            <Typography
                                sx={{
                                    mt: { xs: 2, md: 0 },
                                    py: 1.8,
                                    textAlign: "end",
                                }}
                                variant="subtitle2"
                            >
                                Showing{" "}
                                {`${questions.length == 0 ? 0 : 1}-${
                                    page * limit > count ? count : page * limit
                                } of ${count}`}{" "}
                                Results
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Divider />
                {!isLoading && questions?.length === 0 ? (
                    <Typography
                        sx={{
                            py: 10,
                        }}
                        variant="h3"
                        fontWeight="normal"
                        color="text.secondary"
                        align="center"
                    >
                        {!payload?.subject
                            ? t("Please select a subject")
                            : t("No data found for the selected filters")}
                    </Typography>
                ) : (
                    <>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {SUBJECTS_TABLE_HEADERS.map((head) => (
                                            <TableCell
                                                key={head.value}
                                                align={head.align || "left"}
                                                onClick={() =>
                                                    head.isSortable &&
                                                    handleSort(head.value)
                                                }
                                                sx={{
                                                    cursor: head.isSortable
                                                        ? "pointer"
                                                        : "default",
                                                }}
                                            >
                                                {t(head.label)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {isFirstPageLoading
                                        ? ""
                                        : questions?.map((item, index) => {
                                              return (
                                                  <TableRow
                                                      hover
                                                      key={item?.id}
                                                      selected={index % 2 !== 0}
                                                  >
                                                      <TableCell>
                                                          <Checkbox
                                                              checked={selectedQuestions.includes(
                                                                  item?._id,
                                                              )}
                                                              //   indeterminate={
                                                              //       selectedSomeProducts
                                                              //   }
                                                              onChange={() =>
                                                                  handleSelectQuestions(
                                                                      item?._id,
                                                                  )
                                                              }
                                                          />
                                                      </TableCell>
                                                      <TableCell
                                                          sx={{
                                                              maxWidth: 300,
                                                              whiteSpace:
                                                                  "nowrap",
                                                              overflow:
                                                                  "hidden",
                                                              textOverflow:
                                                                  "ellipsis",
                                                          }}
                                                      >
                                                          {!item?.isFormatted ? (
                                                              item?.question
                                                          ) : (
                                                              <QuestionFormatter
                                                                  data={
                                                                      item?.question
                                                                  }
                                                              />
                                                          )}
                                                      </TableCell>
                                                      <TableCell align="center">
                                                          {item?.marks || ""}
                                                      </TableCell>
                                                      <TableCell align="center">
                                                          {getQuestionTypeName(
                                                              item?.type || "",
                                                          )}
                                                          {/* <Label color="success"> */}
                                                          {/* <b> */}
                                                          {/* </b> */}
                                                          {/* </Label> */}
                                                      </TableCell>
                                                      <TableCell>
                                                          <Typography>
                                                              {getUnitName(
                                                                  item?.unit,
                                                              )}
                                                          </Typography>
                                                      </TableCell>

                                                      <TableCell
                                                          align="center"
                                                          sx={{
                                                              maxWidth: 180,
                                                          }}
                                                      >
                                                          <Typography noWrap>
                                                              <Tooltip
                                                                  title={t(
                                                                      "View details",
                                                                  )}
                                                                  arrow
                                                              >
                                                                  <IconButton
                                                                      onClick={() =>
                                                                          handleOpenModal(
                                                                              item,
                                                                          )
                                                                      }
                                                                      color="primary"
                                                                  >
                                                                      <ListTwoToneIcon fontSize="small" />
                                                                  </IconButton>
                                                              </Tooltip>
                                                              {/* <Tooltip
                                                                  title={t(
                                                                      "Edit Question",
                                                                  )}
                                                                  arrow
                                                              >
                                                                  <IconButton
                                                                      onClick={() =>
                                                                          handleEditRoute(
                                                                              item,
                                                                          )
                                                                      }
                                                                      color="primary"
                                                                      sx={{
                                                                          ml: 1,
                                                                      }}
                                                                  >
                                                                      <EditTwoToneIcon fontSize="small" />
                                                                  </IconButton>
                                                              </Tooltip>
                                                              <Tooltip
                                                                  title={t(
                                                                      "Status",
                                                                  )}
                                                                  arrow
                                                              >
                                                                  <Switch
                                                                      checked={
                                                                          item?.isActive
                                                                      }
                                                                      onChange={(
                                                                          e,
                                                                      ) =>
                                                                          toggleQuestionStatus(
                                                                              item?._id,
                                                                          )
                                                                      }
                                                                      name="is_approved"
                                                                      color="primary"
                                                                      sx={{
                                                                          ml: 1,
                                                                      }}
                                                                  />
                                                              </Tooltip> */}
                                                              {/* <IconButton
                                                            color="error"
                                                            onClick={() => {}}                                                        
                                                        >
                                                            <DeleteTwoToneIcon />
                                                        </IconButton> */}
                                                          </Typography>
                                                      </TableCell>
                                                  </TableRow>
                                              );
                                          })}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Infinite Scroll Loader */}
                        {isLoading && (
                            <Box display="flex" justifyContent="center" p={2}>
                                <CircularProgress />
                            </Box>
                        )}

                        {/* Loader for Intersection Observer */}
                        {hasMore && !isLoading && (
                            <Box
                                ref={viewRef}
                                display="flex"
                                justifyContent="center"
                                p={2}
                            >
                                <Typography>Loading more...</Typography>
                            </Box>
                        )}
                    </>
                )}
            </Card>
            <Fab
                color="primary"
                aria-label="preview"
                onClick={toggleOpenConfirmGenerate}
                sx={{
                    position: "fixed",
                    bottom: (theme) => theme.spacing(4),
                    right: (theme) => theme.spacing(4),
                    zIndex: 1300,
                    boxShadow: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    py: 1,
                    px: 1,
                    borderRadius: 1,
                    width: totalSelectedMarks > 0 ? "auto" : undefined,
                }}
            >
                <PreviewIcon />
                {totalSelectedMarks > 0 && (
                    <Typography
                        variant="subtitle2"
                        sx={{
                            color: "white",
                            fontWeight: 600,
                            ml: 1,
                            mr: 1,
                        }}
                    >
                        ({totalSelectedMarks})
                    </Typography>
                )}
            </Fab>

            <DialogWrapper
                open={openConfirmGenerate}
                maxWidth="sm"
                fullWidth
                keepMounted
                onClose={toggleOpenConfirmGenerate}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    p={5}
                >
                    {/* <AvatarInfo>
                        <PreviewIcon fontSize="inherit" />
                    </AvatarInfo> */}
                    <Typography
                        align="center"
                        sx={{
                            py: 4,
                            px: 2,
                        }}
                        variant="h3"
                    >
                        {t("Are you sure you want to generate the paper?")}
                    </Typography>
                    <Box>
                        <Button
                            variant="text"
                            size="large"
                            sx={{
                                mx: 1,
                            }}
                            onClick={toggleOpenConfirmGenerate}
                        >
                            {t("Cancel")}
                        </Button>
                        <Button
                            onClick={handleGeneratePaper}
                            disabled={selectedQuestions.length === 0}
                            size="large"
                            sx={{
                                px: 3,
                                mr: 1,
                            }}
                            variant="contained"
                            color="primary"
                        >
                            {t("Generate")}
                        </Button>
                    </Box>
                </Box>
            </DialogWrapper>

            <Dialog
                fullWidth
                maxWidth="md"
                open={!!currentItem}
                onClose={handleCloseModal}
            >
                <DialogTitle
                    sx={{
                        p: 2,
                    }}
                >
                    <Typography variant="h3" gutterBottom>
                        {t("Question Details:")}
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container alignItems="center" sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <Typography variant="h5">Question :</Typography>
                            <Typography sx={{ mb: 2, p: 1 }}>
                                {currentItem?.isFormatted ? (
                                    <QuestionFormatter
                                        data={currentItem?.question}
                                    />
                                ) : (
                                    currentItem?.question
                                )}
                            </Typography>
                            <Divider />
                            <Typography variant="h5" sx={{ mt: 2 }}>
                                Answer :
                            </Typography>
                            <Typography sx={{ mb: 2, p: 1 }}>
                                {currentItem?.answer}
                            </Typography>
                            <Divider />
                            <Typography variant="h5" sx={{ mt: 2 }}>
                                Question Type :
                            </Typography>
                            <Typography sx={{ p: 1 }}>
                                {getQuestionTypeName(currentItem?.type || "")}
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Results;

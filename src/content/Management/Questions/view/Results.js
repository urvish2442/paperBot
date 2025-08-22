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
} from "@mui/material";

import { useTranslation } from "react-i18next";
import Text from "src/components/Text";
import ListTwoToneIcon from "@mui/icons-material/ListTwoTone";

import { useSubjectQuestions } from "src/hooks/useFetchHooks";
import QuestionFormatter from "../QuestionFormatter";
import { useSelector } from "react-redux";
import { globalState } from "src/redux/slices/global";
import { useInView } from "react-intersection-observer";

const Results = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down("md"));
    const { filtersData, subjectFiltersData, currentFilter } =
        useSelector(globalState);

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
                <Text color={textColor}>
                    {`${matchedUnit.number}: ${matchedUnit.name}`}
                </Text>
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
                return preVal?.filter((item) => item !== id);
            } else {
                return [...preVal, id];
            }
        });
    };

    return (
        <>
            <Grid item xs={12}>
                <Card>
                    {/* <CardHeader title={t("Subject Information")} />
                    <Divider /> */}
                </Card>
            </Grid>
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
            <Button variant="contained" onClick={handleAddQuestionIds}>
                Preview Question Paper
            </Button>
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

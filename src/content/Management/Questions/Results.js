import { useMemo, useCallback } from "react";
import PropTypes from "prop-types";

import {
    Box,
    Card,
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
    styled,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    DialogContent,
    Grid,
    DialogTitle,
    DialogActions,
    CircularProgress,
} from "@mui/material";

import { useTranslation } from "react-i18next";
import Text from "src/components/Text";
import ListTwoToneIcon from "@mui/icons-material/ListTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";

import { useQuestions } from "src/hooks/useFetchHooks";
import QuestionFormatter from "./QuestionFormatter";
import { useSelector } from "react-redux";
import { globalState } from "src/redux/slices/global";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/router";
import { PATH_DASHBOARD } from "src/routes/paths";

const Results = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const { push } = useRouter();
    const mobile = useMediaQuery(theme.breakpoints.down("md"));
    const { filtersData, subjectFiltersData, currentFilter } =
        useSelector(globalState);

    const SUBJECTS_TABLE_HEADERS = [
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
        subjectNames,
        hasMore,
        currentItem,
        handleOpenModal,
        handleCloseModal,
        handlePageChange,
        handleFilterChange,
        handleSort,
        toggleQuestionStatus,
    } = useQuestions();

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

    const getUnitName = useCallback(
        (unitId) => {
            if (!unitId) return "";
            const matchedUnit = currentUnits.find(
                (unit) => unit._id === unitId,
            );
            if (!matchedUnit) return "";
            const textColor = matchedUnit?.isActive ? "default" : "error";

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

    const handleEditRoute = useCallback(
        (item) => {
            push(
                PATH_DASHBOARD.questions.edit(currentFilter.subject, item?._id),
            );
        },
        [push, PATH_DASHBOARD, currentFilter.subject],
    );

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
                        <Grid item xs={12} md={4}>
                            <FormControl
                                variant="outlined"
                                fullWidth
                                // size="small"
                                // sx={{ maxWidth: 300 }}
                            >
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
                                    {/* <MenuItem value="all">
                                        <em>Select Subject...</em>
                                    </MenuItem> */}
                                    {subjectNames.map((subject) => (
                                        <MenuItem key={subject} value={subject}>
                                            {subject.toUpperCase()}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <FormControl
                                variant="outlined"
                                fullWidth
                                // size="small"
                                // sx={{ maxWidth: 300 }}
                            >
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
                        <Grid item xs={6} md={3}>
                            <FormControl
                                variant="outlined"
                                fullWidth
                                // size="small"
                                // sx={{ maxWidth: 300 }}
                            >
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
                        <Grid item xs={6} md={2}>
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
                                        {/* <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedAllProducts}
                                                indeterminate={
                                                    selectedSomeProducts
                                                }
                                                onChange={
                                                    handleSelectAllProducts
                                                }
                                            />
                                        </TableCell> */}
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
                                                              <Tooltip
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
                                                              </Tooltip>
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
                    {/* <Typography variant="subtitle2">
                        {t(
                            "Fill in the fields below to update Units in Subject",
                        )}
                    </Typography> */}
                </DialogTitle>
                {/* <form onSubmit={formik.handleSubmit}> */}
                <DialogContent dividers>
                    {/* <Typography variant="h6">Add Units</Typography> */}
                    <Grid
                        container
                        // spacing={2}
                        alignItems="center"
                        sx={{ mt: 1 }}
                    >
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
                        {/* <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Unit Name"
                                        name={`units[${index}].name`}
                                        value={formik.values.units[index].name}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        error={
                                            formik.touched.units?.[index]
                                                ?.name &&
                                            Boolean(
                                                formik.errors.units?.[index]
                                                    ?.name,
                                            )
                                        }
                                        helperText={
                                            formik.touched.units?.[index]
                                                ?.name &&
                                            formik.errors.units?.[index]?.name
                                        }
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton
                                        color="error"
                                        onClick={() => {
                                            const newUnits =
                                                formik.values.units.filter(
                                                    (_, i) => i !== index,
                                                );
                                            formik.setFieldValue(
                                                "units",
                                                newUnits,
                                            );
                                        }}
                                        disabled={
                                            formik.values.units.length === 1 ||
                                            index < currentItem?.units?.length
                                        } // Prevent removal of the last item
                                    >
                                        <DeleteTwoToneIcon />
                                    </IconButton>
                                    <Tooltip title={t("Active")} arrow>
                                        <Switch
                                            checked={
                                                formik.values.units[index]
                                                    .isActive
                                            }
                                            onChange={formik.handleChange}
                                            name={`units[${index}].isActive`}
                                            color="primary"
                                            sx={{ ml: 1 }}
                                        />
                                    </Tooltip>
                                </Grid> */}
                    </Grid>
                    {/* <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                            onClick={() => {
                                formik.setFieldValue("units", [
                                    ...formik.values.units,
                                    { number: "", name: "", isActive: true },
                                ]);
                            }}
                        >
                            Add Unit
                        </Button> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} variant="contained">
                        Close
                    </Button>
                    {/* <Button
                        type="submit"
                        // disabled={formik.isSubmitting}
                        // startIcon={
                        //     formik.isSubmitting ? (
                        //         <CircularProgress size="1rem" />
                        //     ) : null
                        // }
                        variant="contained"
                    >
                        Submit
                    </Button> */}
                </DialogActions>
                {/* </form> */}
            </Dialog>
            {/* <DialogWrapper
                open={openConfirmDelete}
                maxWidth="sm"
                fullWidth
                TransitionComponent={Transition}
                keepMounted
                onClose={closeConfirmDelete}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    p={5}
                >
                    <AvatarError>
                        <CloseIcon />
                    </AvatarError>

                    <Typography
                        align="center"
                        sx={{
                            pt: 4,
                            px: 6,
                        }}
                        variant="h3"
                    >
                        {t("Do you really want to delete this subject")}?
                    </Typography>

                    <Typography
                        align="center"
                        sx={{
                            pt: 2,
                            pb: 4,
                            px: 6,
                        }}
                        fontWeight="normal"
                        color="text.secondary"
                        variant="h4"
                    >
                        {t("You won't be able to revert after deletion")}
                    </Typography>

                    <Box>
                        <Button
                            variant="text"
                            size="large"
                            sx={{
                                mx: 1,
                            }}
                            onClick={closeConfirmDelete}
                        >
                            {t("Cancel")}
                        </Button>
                        <ButtonError
                            onClick={handleDeleteCompleted}
                            size="large"
                            sx={{
                                mx: 1,
                                px: 3,
                            }}
                            variant="contained"
                        >
                            {t("Delete")}
                        </ButtonError>
                    </Box>
                </Box>
            </DialogWrapper> */}
        </>
    );
};

Results.propTypes = {
    products: PropTypes.array.isRequired,
};

Results.defaultProps = {
    products: [],
};

export default Results;

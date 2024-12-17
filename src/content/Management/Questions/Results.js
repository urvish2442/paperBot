import { useState, forwardRef, useMemo } from "react";
import PropTypes from "prop-types";

import numeral from "numeral";

import {
    Avatar,
    Box,
    Card,
    Checkbox,
    Slide,
    Divider,
    Tooltip,
    IconButton,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableContainer,
    TableRow,
    TextField,
    Button,
    Typography,
    Dialog,
    useMediaQuery,
    useTheme,
    Zoom,
    styled,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    DialogContent,
    Grid,
    DialogTitle,
    Autocomplete,
    DialogActions,
    CircularProgress,
} from "@mui/material";
import Link from "src/components/Link";

import { useTranslation } from "react-i18next";
import Label from "src/components/Label";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import Text from "src/components/Text";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import ListTwoToneIcon from "@mui/icons-material/ListTwoTone";

import { useQuestions, useSubjects } from "src/hooks/useFetchHooks";
import {
    LABEL_FOR_BOARDS,
    LABEL_FOR_MEDIUM,
    LABEL_FOR_QUESTION_TYPES,
    LABEL_FOR_STANDARDS,
    LABEL_FOR_SUBJECTS,
} from "src/constants/keywords";
import Preview from "../Subjects/create/Preview";
import QuestionFormatter from "./QuestionFormatter";
import { useSelector } from "react-redux";
import { globalState } from "src/redux/slices/global";

const DialogWrapper = styled(Dialog)(
    () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`,
);

const ImgWrapper = styled("img")(
    ({ theme }) => `
      width: ${theme.spacing(8)};
      height: auto;
`,
);

const AvatarError = styled(Avatar)(
    ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color: ${theme.colors.error.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`,
);

const ButtonError = styled(Button)(
    ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `,
);

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const applyPagination = (products, page, limit) => {
    return products.slice(page * limit, page * limit + limit);
};

const Results = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down("md"));
    const { filtersData, subjectFiltersData, currentFilter } =
        useSelector(globalState);

    const SUBJECTS_TABLE_HEADERS = [
        { value: "question", label: "Question", isSortable: true },
        { value: "marks", label: "Marks", isSortable: true, align: "center" },
        { value: "type", label: "Type", isSortable: false, align: "center" },
        { value: "unit", label: "Unit", isSortable: false, align: "center" },
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
    } = useQuestions();

    const currentUnits = useMemo(() => {
        const matchedSubject = subjectFiltersData.find(
            (subject) => subject.model_name === currentFilter.subject,
        );
        return matchedSubject ? matchedSubject.units : [];
    }, [subjectFiltersData, currentFilter.subject]);

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
                                    <MenuItem value="all">
                                        <em>Select Subject...</em>
                                    </MenuItem>
                                    {subjectNames.map((subject) => (
                                        <MenuItem key={subject} value={subject}>
                                            {subject.toUpperCase()}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
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
                                    {filtersData?.questionTypes?.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {LABEL_FOR_QUESTION_TYPES[type] ||
                                                type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
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
                    </Grid>
                </Box>
                <Divider />
                {questions?.length === 0 ? (
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
                            : t(
                                  "We couldn't find any products matching your search criteria",
                              )}
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
                                    {questions.map((item, index) => {
                                        return (
                                            <TableRow
                                                hover
                                                key={item?.id}
                                                selected={index % 2 !== 0}
                                            >
                                                <TableCell>
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
                                                    {
                                                        LABEL_FOR_QUESTION_TYPES[
                                                            item?.type || ""
                                                        ]
                                                    }
                                                    {/* <Label color="success"> */}
                                                    {/* <b> */}
                                                    {/* </b> */}
                                                    {/* </Label> */}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {item?.unit || ""}
                                                </TableCell>

                                                <TableCell align="center">
                                                    <Typography noWrap>
                                                        <Tooltip
                                                            title={t(
                                                                "View details",
                                                            )}
                                                            arrow
                                                        >
                                                            <IconButton
                                                                onClick={
                                                                    () => {}
                                                                    // handleOpenModal(
                                                                    //     item,
                                                                    // )
                                                                }
                                                                color="primary"
                                                            >
                                                                <ListTwoToneIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip
                                                            title={t("Status")}
                                                            arrow
                                                        >
                                                            <Switch
                                                                checked={
                                                                    item?.isActive
                                                                }
                                                                onChange={(e) =>
                                                                    toggleitemStatus(
                                                                        item?._id,
                                                                        item?.isActive,
                                                                    )
                                                                }
                                                                name="is_approved"
                                                                color="primary"
                                                                sx={{ ml: 1 }}
                                                            />
                                                        </Tooltip>
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box p={2}>
                            <TablePagination
                                component="div"
                                count={count || 0}
                                onPageChange={handlePageChange}
                                labelRowsPerPage=""
                                rowsPerPageOptions={[]}
                                // onRowsPerPageChange={handleLimitChange}
                                page={page - 1 >= 0 ? page - 1 : 0}
                                rowsPerPage={limit}
                                disabled={isLoading}
                            />
                        </Box>
                    </>
                )}
            </Card>
            {/* <Dialog
                fullWidth
                maxWidth="md"
                open={!!currentItem}
                onClose={handleCloseModal}
            >
                <DialogTitle
                    sx={{
                        p: 3,
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        {t("Add Units in Subject : ") +
                            currentItem?.model_name?.toUpperCase()}
                    </Typography>
                    <Typography variant="subtitle2">
                        {t(
                            "Fill in the fields below to update Units in Subject",
                        )}
                    </Typography>
                </DialogTitle>
                <form onSubmit={formik.handleSubmit}>
                    <DialogContent dividers>
                        <Typography variant="h6">Add Units</Typography>
                        {formik.values.units.map((unit, index) => (
                            <Grid
                                container
                                spacing={2}
                                key={index}
                                alignItems="center"
                                sx={{ mt: 1 }}
                            >
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Unit Number"
                                        name={`units[${index}].number`}
                                        type="number"
                                        value={
                                            formik.values.units[index].number
                                        }
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        error={
                                            formik.touched.units?.[index]
                                                ?.number &&
                                            Boolean(
                                                formik.errors.units?.[index]
                                                    ?.number,
                                            )
                                        }
                                        helperText={
                                            formik.touched.units?.[index]
                                                ?.number &&
                                            formik.errors.units?.[index]?.number
                                        }
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={6}>
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
                                </Grid>
                            </Grid>
                        ))}
                        <Button
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
                        </Button>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal} color="secondary">
                            Cancel
                        </Button>
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
                    </DialogActions>
                </form>
            </Dialog> */}
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

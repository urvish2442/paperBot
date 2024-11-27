import { useState, forwardRef } from "react";
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
} from "@mui/material";
import Link from "src/components/Link";

import CloseIcon from "@mui/icons-material/Close";

import { useTranslation } from "react-i18next";
import LaunchTwoToneIcon from "@mui/icons-material/LaunchTwoTone";
import Label from "src/components/Label";
import BulkActions from "./BulkActions";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { useSnackbar } from "notistack";
import Text from "src/components/Text";
import LocalFireDepartmentTwoToneIcon from "@mui/icons-material/LocalFireDepartmentTwoTone";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import { useCreators, useSubjects } from "src/hooks/useFetchHooks";
import {
    LABEL_FOR_BOARDS,
    LABEL_FOR_MEDIUM,
    LABEL_FOR_STANDARDS,
    LABEL_FOR_SUBJECTS,
} from "src/constants/keywords";

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

const Results = ({ products }) => {
    const SUBJECTS_TABLE_HEADERS = [
        { value: "name", label: "Name", isSortable: true },
        {
            value: "standard",
            label: "Standard",
            isSortable: true,
            align: "center",
        },

        { value: "code", label: "Code", isSortable: false, align: "center" },
        { value: "board", label: "Board", isSortable: true, align: "center" },
        {
            value: "price",
            label: "Price",
            align: "center",
            isSortable: false,
        },
        {
            value: "medium",
            label: "Medium",
            isSortable: false,
            align: "center",
        },
        {
            value: "actions",
            label: "Actions",
            align: "center",
            isSortable: false,
        },
    ];
    const {
        items: subjects,
        loading: isLoading,
        count,
        hasMore,
        page,
        limit,
        payload,
        handleQueryChange,
        handlePageChange,
        handleLimitChange,
        handleFilterChange,
        handleSort,
    } = useSubjects();
    const [selectedItems, setSelectedProducts] = useState([]);
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down("md"));

    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

    const handleConfirmDelete = () => {
        setOpenConfirmDelete(true);
    };

    const closeConfirmDelete = () => {
        setOpenConfirmDelete(false);
    };

    const handleDeleteCompleted = () => {
        setOpenConfirmDelete(false);

        enqueueSnackbar(t("You successfully deleted the product"), {
            variant: "success",
            anchorOrigin: {
                vertical: "top",
                horizontal: "right",
            },
            TransitionComponent: Zoom,
        });
    };

    return (
        <>
            <Card>
                <Box display="flex" alignItems="center">
                    {/* {selectedBulkActions && (
                        <Box flex={1} p={2}>
                            <BulkActions />
                        </Box>
                    )} */}
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
                                onChange={handleQueryChange}
                                value={payload?.search || ""}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchTwoToneIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                placeholder={t("Search by product name...")}
                            />
                        </Box>
                        <Box
                            py={2}
                            display="flex"
                            alignItems="center"
                            flexDirection={{ xs: "row", sm: "row" }}
                            justifyContent={{
                                xs: "flex-start",
                                sm: "flex-end",
                            }}
                            pb={3}
                            gap={{ sm: 2, xs: 1 }}
                        >
                            {/* Subject */}
                            <FormControl
                                size="small"
                                variant="outlined"
                                sx={{ width: 90 }}
                            >
                                <InputLabel>Subject</InputLabel>
                                <Select
                                    value={
                                        payload.name === null
                                            ? "all"
                                            : payload.name
                                    }
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "name",
                                            e.target.value,
                                        )
                                    }
                                    label="Subject"
                                    disabled={isLoading}
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    {Object.entries(LABEL_FOR_SUBJECTS).map(
                                        ([key, label]) => (
                                            <MenuItem key={key} value={key}>
                                                {label}
                                            </MenuItem>
                                        ),
                                    )}
                                </Select>
                            </FormControl>
                            {/* Standard */}
                            <FormControl
                                size="small"
                                variant="outlined"
                                sx={{ width: 90 }}
                            >
                                <InputLabel>Standard</InputLabel>
                                <Select
                                    value={
                                        payload.standard === null
                                            ? "all"
                                            : payload.standard
                                    }
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "standard",
                                            e.target.value,
                                        )
                                    }
                                    label="Standard"
                                    disabled={isLoading}
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    {Object.entries(LABEL_FOR_STANDARDS).map(
                                        ([key, label]) => (
                                            <MenuItem key={key} value={key}>
                                                {" "}
                                                {label}
                                            </MenuItem>
                                        ),
                                    )}
                                </Select>
                            </FormControl>
                            {/* Board */}
                            <FormControl
                                size="small"
                                variant="outlined"
                                sx={{ width: 90 }}
                            >
                                <InputLabel>Board</InputLabel>
                                <Select
                                    value={
                                        payload.board === null
                                            ? "all"
                                            : payload.board
                                    }
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "board",
                                            e.target.value,
                                        )
                                    }
                                    label="Board"
                                    disabled={isLoading}
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    {Object.entries(LABEL_FOR_BOARDS).map(
                                        ([key, label]) => (
                                            <MenuItem key={key} value={key}>
                                                {" "}
                                                {label}
                                            </MenuItem>
                                        ),
                                    )}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                </Box>
                <Divider />

                {subjects?.length === 0 ? (
                    <Typography
                        sx={{
                            py: 10,
                        }}
                        variant="h3"
                        fontWeight="normal"
                        color="text.secondary"
                        align="center"
                    >
                        {t(
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
                                    {subjects.map((subject, index) => {
                                        const isProductSelected =
                                            selectedItems.includes(subject.id);
                                        return (
                                            <TableRow
                                                hover
                                                key={
                                                    subject.id ||
                                                    subject.model_name
                                                }
                                                selected={index % 2 !== 0}
                                            >
                                                {/* <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={
                                                            isProductSelected
                                                        }
                                                        onChange={(event) =>
                                                            handleSelectOneProduct(
                                                                event,
                                                                subject.id,
                                                            )
                                                        }
                                                        value={
                                                            isProductSelected
                                                        }
                                                    />
                                                </TableCell> */}
                                                <TableCell>
                                                    <Box
                                                        display="flex"
                                                        alignItems="center"
                                                    >
                                                        <Box
                                                            // pl={1}
                                                            // sx={{
                                                            //     width: 250,
                                                            // }}
                                                        >
                                                            <Link
                                                                href="#"
                                                                variant="h5"
                                                            >
                                                                {subject?.name ||
                                                                    ""}
                                                            </Link>
                                                            <Typography
                                                                variant="subtitle2"
                                                                noWrap
                                                            >
                                                                {subject?.model_name ||
                                                                    ""}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {
                                                        LABEL_FOR_STANDARDS[
                                                            subject?.standard ||
                                                                ""
                                                        ]
                                                    }
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Label color="success">
                                                        <b>
                                                            {subject?.code ||
                                                                ""}
                                                        </b>
                                                    </Label>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {/* <Box
                                                        display="flex"
                                                        alignItems="center"
                                                    >
                                                        <Text color="warning">
                                                            <LocalFireDepartmentTwoToneIcon fontSize="small" />
                                                        </Text>
                                                        <Typography
                                                            variant="h5"
                                                            sx={{
                                                                pl: 0.5,
                                                            }}
                                                        > */}
                                                    {subject?.board || ""}
                                                    {/* </Typography>
                                                    </Box> */}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {/* <Typography
                                                        sx={{
                                                            textDecorationLine:
                                                                subject.sale_price !==
                                                                0
                                                                    ? "line-through"
                                                                    : "",
                                                        }}
                                                    >
                                                        ₹
                                                        {numeral(
                                                            subject.price,
                                                        ).format(`0,0.00`)}
                                                    </Typography> */}
                                                    {subject?.price !== 0 && (
                                                        <Typography>
                                                            <Text color="error">
                                                                ₹
                                                                {numeral(
                                                                    subject?.price,
                                                                ).format(
                                                                    `0,0.00`,
                                                                )}
                                                            </Text>
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {
                                                        LABEL_FOR_MEDIUM[
                                                            subject?.medium ||
                                                                ""
                                                        ]
                                                    }
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography noWrap>
                                                        <Tooltip
                                                            title={t("View")}
                                                            arrow
                                                        >
                                                            <IconButton
                                                                component={Link}
                                                                href="/management/commerce/products/single/1"
                                                                color="primary"
                                                            >
                                                                <LaunchTwoToneIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip
                                                            title={t("Delete")}
                                                            arrow
                                                        >
                                                            <IconButton
                                                                onClick={
                                                                    handleConfirmDelete
                                                                }
                                                                color="primary"
                                                            >
                                                                <DeleteTwoToneIcon fontSize="small" />
                                                            </IconButton>
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
                                onRowsPerPageChange={handleLimitChange}
                                page={page - 1 >= 0 ? page - 1 : 0}
                                rowsPerPage={limit}
                                rowsPerPageOptions={[5, 10, 15]}
                                disabled={isLoading}
                            />
                        </Box>
                    </>
                )}
            </Card>
            <DialogWrapper
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
            </DialogWrapper>
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

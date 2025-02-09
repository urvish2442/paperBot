import PropTypes from "prop-types";
import {
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableContainer,
    TableRow,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import Link from "src/components/Link";
import { useTranslation } from "react-i18next";
import { useQuestionTypes } from "src/hooks/useFetchHooks";

const Results = () => {
    const SUBJECTS_TABLE_HEADERS = [
        { value: "name", label: "Name", isSortable: false },
        {
            value: "description",
            label: "Description",
            isSortable: false,
            // align: "center",
        },
    ];
    const {
        items,
        loading: isLoading,
        count,
        hasMore,
        page,
        limit,
        handlePageChange,
        handleLimitChange,
    } = useQuestionTypes();

    const { t } = useTranslation();
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <>
            <Card>
                {items?.length === 0 ? (
                    <Typography
                        sx={{
                            py: 10,
                        }}
                        variant="h3"
                        fontWeight="normal"
                        color="text.secondary"
                        align="center"
                    >
                        {t("No Data Found")}
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
                                                // onClick={() =>
                                                //     head.isSortable &&
                                                //     handleSort(head.value)
                                                // }
                                                // sx={{
                                                //     cursor: head.isSortable
                                                //         ? "pointer"
                                                //         : "default",
                                                // }}
                                            >
                                                {t(head.label)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((item, index) => (
                                        <TableRow
                                            hover
                                            key={item.id || item.model_name}
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
                                                                item.id,
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
                                                    <Box>
                                                        <Link
                                                            href="#"
                                                            variant="h5"
                                                        >
                                                            {item?.name || ""}
                                                        </Link>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {item?.description || ""}
                                            </TableCell>
                                            {/* <TableCell align="center">
                                                    <Typography noWrap>                                                        
                                                        <Tooltip
                                                            title={t("Status")}
                                                            arrow
                                                        >
                                                            <Switch
                                                                checked={
                                                                    item?.isActive
                                                                }
                                                                onChange={(e) =>
                                                                    toggleSubjectStatus(
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
                                                </TableCell> */}
                                        </TableRow>
                                    ))}
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

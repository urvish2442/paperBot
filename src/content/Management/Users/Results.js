import { useState, forwardRef, useCallback } from "react";
import {
    Avatar,
    Box,
    Card,
    Checkbox,
    Grid,
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
    ToggleButton,
    ToggleButtonGroup,
    Tab,
    Tabs,
    TextField,
    Button,
    Typography,
    Dialog,
    Zoom,
    styled,
    Switch,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import Link from "src/components/Link";

import CloseIcon from "@mui/icons-material/Close";

import { useTranslation } from "react-i18next";
import clsx from "clsx";
import LaunchTwoToneIcon from "@mui/icons-material/LaunchTwoTone";
import Label from "src/components/Label";
import BulkActions from "./BulkActions";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import GridViewTwoToneIcon from "@mui/icons-material/GridViewTwoTone";
import TableRowsTwoToneIcon from "@mui/icons-material/TableRowsTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { useSnackbar } from "notistack";
import MoreVertTwoToneIcon from "@mui/icons-material/MoreVertTwoTone";
import PersonAddTwoToneIcon from "@mui/icons-material/PersonAddTwoTone";
import Loader from "src/components/Loader";
import { useCreators } from "src/hooks/useFetchHooks";

const DialogWrapper = styled(Dialog)(
    () => `
      .MuiDialog-paper {
        overflow: visible;
      }
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

const CardWrapper = styled(Card)(
    ({ theme }) => `

  position: relative;
  overflow: visible;

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: inherit;
    z-index: 1;
    transition: ${theme.transitions.create(["box-shadow"])};
  }
      
    &.Mui-selected::after {
      box-shadow: 0 0 0 3px ${theme.colors.primary.main};
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

const TabsWrapper = styled(Tabs)(
    ({ theme }) => `
    @media (max-width: ${theme.breakpoints.values.md}px) {
      .MuiTabs-scrollableX {
        overflow-x: auto !important;
      }

      .MuiTabs-indicator {
          box-shadow: none;
      }
    }
    `,
);

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const getUserRoleLabel = (userRole) => {
    const map = {
        admin: {
            text: "Administrator",
            color: "error",
        },
        customer: {
            text: "Customer",
            color: "info",
        },
        subscriber: {
            text: "Subscriber",
            color: "warning",
        },
    };

    const { text, color } = map[userRole];

    return <Label color={color}>{text}</Label>;
};

const Results = () => {
    const CREATOR_TABLE_HEADERS = [
        { value: "username", label: "User Name", isSortable: true },
        { value: "email", label: "Email", isSortable: true },
        { value: "role", label: "Role", isSortable: true },
        // {
        //     value: "commission_percentage",
        //     label: "Commission (%)",
        //     align: "center",
        //     isSortable: false,
        // },
        {
            value: "actions",
            label: "Actions",
            align: "center",
            isSortable: false,
        },
    ];
    const {
        items,
        loading: isLoading,
        count,
        hasMore,
        page,
        page_size,
        payload,
        handleQueryChange,
        handlePageChange,
        handleLimitChange,
        handleFilterChange,
        handleSort,
    } = useCreators();
    const { t } = useTranslation();

    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

    const handleConfirmDelete = () => {
        setOpenConfirmDelete(true);
    };

    const closeConfirmDelete = () => {
        setOpenConfirmDelete(false);
    };

    const handleDeleteCompleted = () => {
        setOpenConfirmDelete(false);

        // enqueueSnackbar(t("The user account has been removed"), {
        //     variant: "success",
        //     anchorOrigin: {
        //         vertical: "top",
        //         horizontal: "right"
        //     },
        //     TransitionComponent: Zoom
        // });
    };

    const getUserRoleLabel = (userRole) => {
        const map = {
            ADMIN: {
                text: "Administrator",
                color: "error",
            },
            USER: {
                text: "User",
                color: "info",
            },
            STAFF: {
                text: "Staff",
                color: "warning",
            },
        };
        const { text, color } = map[userRole];
        return <Label color={color}>{text}</Label>;
    };

    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent={{ xs: "center", sm: "flex-end" }}
                pb={3}
                gap={2}
            >
                <FormControl
                    size="small"
                    variant="outlined"
                    sx={{ width: 100 }}
                >
                    <InputLabel>Active</InputLabel>
                    <Select
                        value={
                            payload.user__is_active === null
                                ? "all"
                                : payload.user__is_active
                        }
                        onChange={(e) =>
                            handleFilterChange("isActive", e.target.value)
                        }
                        label="Active Status"
                        disabled={isLoading}
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="true">Active</MenuItem>
                        <MenuItem value="false">Inactive</MenuItem>
                    </Select>
                </FormControl>
                {/* <FormControl
                    size="small"
                    variant="outlined"
                    sx={{ width: 100 }}
                >
                    <InputLabel>Verified Status</InputLabel>
                    <Select
                        value={
                            payload.is_approved === null
                                ? "all"
                                : payload.is_approved
                        }
                        onChange={(e) =>
                            handleFilterChange("is_approved", e.target.value)
                        }
                        label="Verified Status"
                        disabled={isLoading}
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="true">Verified</MenuItem>
                        <MenuItem value="false">Pending</MenuItem>
                    </Select>
                </FormControl> */}
            </Box>

            <Card>
                <Box p={2}>
                    <TextField
                        sx={{
                            m: 0,
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchTwoToneIcon />
                                </InputAdornment>
                            ),
                        }}
                        onChange={handleQueryChange}
                        placeholder={t("Search by name, email or username...")}
                        value={payload?.search || ""}
                        size="small"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                </Box>

                <Divider />

                {!isLoading && items.length === 0 ? (
                    <>
                        <Typography
                            sx={{
                                py: 10,
                            }}
                            variant="h3"
                            fontWeight="normal"
                            color="text.secondary"
                            align="center"
                        >
                            {t("No data found.")}
                        </Typography>
                    </>
                ) : (
                    <>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {CREATOR_TABLE_HEADERS.map((head) => (
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
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={
                                                    CREATOR_TABLE_HEADERS.length
                                                }
                                            >
                                                <Loader
                                                    size={32}
                                                    defaultLoader={false}
                                                    height={"300px"}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        items.map((user, index) => {
                                            return (
                                                <TableRow hover key={index}>
                                                    <TableCell>
                                                        <Typography variant="h5">
                                                            {/* {user?.username || ""} */}
                                                            <Box
                                                                display="flex"
                                                                alignItems="center"
                                                            >
                                                                <Avatar
                                                                    sx={{
                                                                        mr: 1,
                                                                    }}
                                                                    src={
                                                                        user?.image
                                                                    }
                                                                />
                                                                <Box>
                                                                    <Link
                                                                        variant="h5"
                                                                        href="#"
                                                                    >
                                                                        {
                                                                            user?.username
                                                                        }
                                                                    </Link>
                                                                    {/* <Typography
                                                                    noWrap
                                                                    variant="subtitle2"
                                                                >
                                                                    {
                                                                        user.jobtitle
                                                                    }
                                                                </Typography> */}
                                                                </Box>
                                                            </Box>
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box
                                                            display="flex"
                                                            alignItems="center"
                                                        >
                                                            <Box>
                                                                <Typography
                                                                    noWrap
                                                                    variant="subtitle2"
                                                                >
                                                                    {user?.email ||
                                                                        ""}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>
                                                            {getUserRoleLabel(
                                                                user?.role,
                                                            )}
                                                        </Typography>
                                                    </TableCell>
                                                    {/* <TableCell align="center">
                                                    <Typography fontWeight="bold">
                                                        {user?.role}
                                                    </Typography>
                                                </TableCell> */}
                                                    {/* <TableCell>
                                                    <Switch
                                                        checked={
                                                            user?.is_approved
                                                        }
                                                        onChange={(e) => {}}
                                                        name="is_approved"
                                                        color="primary"
                                                    />
                                                </TableCell> */}
                                                    <TableCell align="center">
                                                        <Typography noWrap>
                                                            {!user?.isActive ? (
                                                                <Tooltip
                                                                    title={t(
                                                                        "Active",
                                                                    )}
                                                                    arrow
                                                                >
                                                                    <IconButton
                                                                        // onClick={
                                                                        //     handleConfirmDelete
                                                                        // }
                                                                        color="primary"
                                                                    >
                                                                        <PersonAddTwoToneIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            ) : (
                                                                <Tooltip
                                                                    title={t(
                                                                        "Delete",
                                                                    )}
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
                                                            )}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
                <Box p={2}>
                    <TablePagination
                        component="div"
                        count={count || 0}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleLimitChange}
                        page={page - 1 >= 0 ? page - 1 : 0}
                        rowsPerPage={page_size || 10}
                        rowsPerPageOptions={[5, 10, 15]}
                        disabled={isLoading}
                    />
                </Box>
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
                            py: 4,
                            px: 6,
                        }}
                        variant="h3"
                    >
                        {t(
                            "Are you sure you want to delete this user account?",
                        )}
                        ?
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

export default Results;

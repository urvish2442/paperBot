import { useRef, useState } from "react";
import { useAuth } from "src/hooks/useAuth";
import { useRouter } from "next/router";

import {
    Avatar,
    Box,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    Popover,
    Typography,
    styled,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import InboxTwoToneIcon from "@mui/icons-material/InboxTwoTone";
import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone";
import AccountBoxTwoToneIcon from "@mui/icons-material/AccountBoxTwoTone";
import LockOpenTwoToneIcon from "@mui/icons-material/LockOpenTwoTone";
import AccountTreeTwoToneIcon from "@mui/icons-material/AccountTreeTwoTone";
import DarkModeTwoToneIcon from "@mui/icons-material/DarkModeTwoTone";
import { PATH_AUTH } from "src/routes/paths";
import {
    TOAST_ALERTS,
    TOAST_TYPES,
    USER_ROLES,
    USER_ROLES_LABEL,
} from "src/constants/keywords";
import useToaster from "src/hooks/useToaster";
import { removeAll } from "src/utils/custom/storage";
import ThemeSettings from "src/components/ThemeSettings";

const UserBoxButton = styled(Button)(
    ({ theme }) => `
        padding: ${theme.spacing(0, 1)};
        height: ${theme.spacing(7)};
`,
);

const MenuUserBox = styled(Box)(
    ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`,
);

const UserBoxText = styled(Box)(
    ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`,
);

const UserBoxLabel = styled(Typography)(
    ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`,
);

const UserBoxDescription = styled(Typography)(
    ({ theme }) => `
        color: ${theme.palette.secondary.light}
`,
);

function HeaderUserbox() {
    const { t } = useTranslation();

    const router = useRouter();
    const { toaster } = useToaster();

    const { user: USER, logout } = useAuth();
    const user = {
        avatar: USER?.image || "/static/images/avatars/1.jpg",
        name: USER?.username || USER?.email || "",
        jobtitle: USER_ROLES_LABEL[USER?.role],
    };

    const ref = useRef(null);
    const [isOpen, setOpen] = useState(false);
    const [showThemeList, setShowThemeList] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setShowThemeList((prev) => !prev);
        setOpen(false);
    };

    const handleLogout = async () => {
        try {
            handleClose();
            const { status } = await logout();
            if (status) {
                toaster(TOAST_TYPES.SUCCESS, TOAST_ALERTS.LOGOUT_SUCCESS);
            } else {
                toaster(TOAST_TYPES.ERROR, TOAST_ALERTS.GENERAL_ERROR);
            }
            router.push(PATH_AUTH.login);
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggleThemeList = () => {
        setShowThemeList((prev) => !prev);
    };

    return (
        <>
            <UserBoxButton color="primary" ref={ref} onClick={handleOpen}>
                <Avatar variant="rounded" alt={user.name} src={user.avatar} />
                <Box
                    component="span"
                    sx={{
                        display: { xs: "none", md: "inline-block" },
                    }}
                >
                    <UserBoxText>
                        <UserBoxLabel variant="body1">{user.name}</UserBoxLabel>
                        <UserBoxDescription variant="body2">
                            {user.jobtitle}
                        </UserBoxDescription>
                    </UserBoxText>
                </Box>
                <Box
                    component="span"
                    sx={{
                        display: { xs: "none", sm: "inline-block" },
                    }}
                >
                    <ExpandMoreTwoToneIcon
                        sx={{
                            ml: 1,
                        }}
                    />
                </Box>
            </UserBoxButton>
            <Popover
                disableScrollLock
                anchorEl={ref.current}
                onClose={handleClose}
                open={isOpen}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <MenuUserBox
                    sx={{
                        minWidth: 210,
                    }}
                    display="flex"
                >
                    <Avatar
                        variant="rounded"
                        alt={user.name}
                        src={user.avatar}
                    />
                    <UserBoxText>
                        <UserBoxLabel variant="body1">{user.name}</UserBoxLabel>
                        <UserBoxDescription variant="body2">
                            {user.jobtitle}
                        </UserBoxDescription>
                    </UserBoxText>
                </MenuUserBox>
                <Divider
                    sx={{
                        mb: 0,
                    }}
                />
                <List
                    sx={{
                        p: 1,
                    }}
                    component="nav"
                >
                    {/* <ListItem
                        onClick={() => {
                            handleClose();
                        }}
                        button
                    >
                        <AccountBoxTwoToneIcon fontSize="small" />
                        <ListItemText primary={t("Profile")} />
                    </ListItem>
                    <ListItem
                        button
                        onClick={() => {
                            handleClose();
                        }}
                    >
                        <InboxTwoToneIcon fontSize="small" />
                        <ListItemText primary={t("Inbox")} />
                    </ListItem>
                    <ListItem
                        button
                        onClick={() => {
                            handleClose();
                        }}
                    >
                        <AccountTreeTwoToneIcon fontSize="small" />
                        <ListItemText primary={t("Projects")} />
                    </ListItem> */}
                    {/* <ListItem
                        button
                        onClick={() => {
                            handleClose();
                        }}
                    >
                        <DarkModeTwoToneIcon fontSize="small" />
                        <ListItemText primary={t("Change Theme")} />
                    </ListItem> */}
                    <ListItem button onClick={handleToggleThemeList}>
                        <DarkModeTwoToneIcon fontSize="small" />
                        <ListItemText primary={t("Change Theme")} />
                    </ListItem>
                    {/* <Divider /> */}
                    {showThemeList && (
                        <Box p={2}>
                            <ThemeSettings closeMenu={handleClose} />
                        </Box>
                    )}
                </List>
                <Divider />
                <Box m={1}>
                    <Button color="primary" fullWidth onClick={handleLogout}>
                        <LockOpenTwoToneIcon
                            sx={{
                                mr: 1,
                            }}
                        />
                        {t("Sign out")}
                    </Button>
                </Box>
            </Popover>
        </>
    );
}

export default HeaderUserbox;

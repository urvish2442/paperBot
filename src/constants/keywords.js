export const TOAST_ALERTS = {
    LOGIN_SUCCESS: "Login Successfully",
    LOGOUT_SUCCESS: "Logout Successfully",
    REGISTER_SUCCESS: "Register Successfully",
    OTP_SENT_SUCCESS: "OTP Sent Successfully",
    PASSWORD_CHANGE_SUCCESS: "Password changed successfully",
    PASSWORD_RESET_SUCCESS: "Password reset successfully",

    GENERAL_ERROR: "Oops! Something went wrong",

    USER_CREATE_SUCCESS: "User created successfully",
    USER_UPDATE_SUCCESS: "User updated successfully",
    USER_DELETE_SUCCESS: "User deleted successfully",
};

export const TOAST_TYPES = {
    SUCCESS: "success",
    WARN: "warn",
    INFO: "info",
    ERROR: "error",
};

export const STORAGE_KEYS = {
    AUTH: "@auth",
    AUTH_TOKEN: "@Token",
    REFRESH_TOKEN: "@RefreshToken",
    APP_THEME: "@appTheme",
    SETTINGS: "@settings",
};

export const USER_ROLES = {
    ADMIN: "ADMIN",
    USER: "USER",
};

export const USER_ROLES_LABEL = {
    [USER_ROLES.ADMIN]: "Admin",
    [USER_ROLES.USER]: "User",
};

export const ALL_ROLES = [USER_ROLES.ADMIN, USER_ROLES.USER];

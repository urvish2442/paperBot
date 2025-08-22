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

    QUESTION_TYPE_UPDATE_SUCCESS: "Question type updated successfully",

    SUBJECT_CREATE_SUCCESS: "Subject created successfully",
    SUBJECT_UPDATE_SUCCESS: "Subject updated successfully",
    SUBJECT_DELETE_SUCCESS: "Subject deleted successfully",

    UNITS_UPDATE_SUCCESS: "Units updated successfully",

    QUESTION_CREATE_SUCCESS: "Question created successfully",
    QUESTION_UPDATE_SUCCESS: "Question updated successfully",
    QUESTION_DELETE_SUCCESS: "Question deleted successfully",

    NO_QUESTIONS_SELECTED: "Please select at least one question",
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

export const LABEL_FOR_BOARDS = {
    GSEB: "GSEB",
    CBSE: "CBSE",
    ICSE: "ICSE",
};

export const LABEL_FOR_SUBJECTS = {
    GUJARATI: "Gujarati",
    HINDI: "Hindi",
    ENGLISH: "English",
};

export const LABEL_FOR_MEDIUM = {
    HINDI_MED: "Hindi Medium",
    ENG_MED: "English Medium",
    GUJ_MED: "Gujarati Medium",
};

export const LABEL_FOR_STANDARDS = {
    STD8: "Std 8",
    STD9: "Std 9",
    STD10: "Std 10",
    STD11: "Std 11",
    STD12: "Std 12",
};

export const LABEL_FOR_QUESTION_TYPES = {
    MCQ: "MCQ",
    SHORT_ANSWER: "Short Answer",
    LONG_ANSWER: "Long Answer",
    TRUE_FALSE: "True/False",
    MATCH_THE_FOLLOWING: "Match the Following",
    ORDER_THE_FOLLOWING: "Order the Following",
    COMPLETE_THE_FOLLOWING: "Complete the Following",
    COMPLETE_THE_SENTENCE: "Complete the Sentence",
    FILL_IN_THE_BLANKS: "Fill in the Blanks",
};

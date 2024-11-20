const getUserRoute = (path) => `users/${path}/`;
const getSubjectsRoute = (path) => `subjects/${path}/`;
const getQuestionsRoute = (path) => `questions/${path}/`;

export const API_ROUTER = {
    // AUTH
    LOGIN: getUserRoute("login"),
    REGISTER: getUserRoute("register"),
    REFRESH_TOKEN: getUserRoute("refresh-token"),
    GET_VERIFY_TOKEN: (token) => getUserRoute(`verify-email/${token}`),
    FORGOT_PASSWORD: getUserRoute("forgot-password"),
    RESET_PASSWORD: (resetToken) => getUserRoute(`reset-password/${resetToken}`),

    //** Secure Routes */
    LOGOUT: getUserRoute("logout"),
    GET_CURRENT_USER: getUserRoute("current-user"),
    CHANGE_PASSWORD: getUserRoute("change-password"),
    RESEND_VERIFICATION_CODE: getUserRoute("resend-email-verification"),


    


    //** Extra */
    VERIFY_CODE: getUserRoute("verify-login-code"),
    REQUEST_PASSWORD_RESET: getUserRoute("request-password-reset"),
    PASSWORD_RESET: getUserRoute("password-reset"),

    // SUPER ADMIN
    CREATE_ADMIN: getUserRoute("create-admin"),

    // ADMIN
    CREATE_CREATOR: getUserRoute("create-creator"),
    GET_CREATORS: getUserRoute("get-creators"),
};

function path(root, sublink) {
    return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = "/dashboard";
const ROOT = "/";

export const PATH_AUTH = {
    root: ROOT,
    login: "/login",
    register: "/register",
    verify: "/verify",
    forgotPassword: "/forgot-password",
};

export const PATH_PAGE = {
    page404: "/404",
};

export const PATH_DASHBOARD = {
    root: ROOTS_DASHBOARD,
    users: {
        root: path(ROOT, "users"),
        add: path(ROOT, "users/add"),
    },
    subjects: {
        root: path(ROOT, "subjects"),
        add: path(ROOT, "subjects/add"),
    },
};

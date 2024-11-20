import { createContext, useEffect, useReducer } from "react";

import { authApi } from "src/mocks/auth";
import PropTypes from "prop-types";
import {
    getData,
    removeAll,
    removeData,
    saveData,
} from "src/utils/custom/storage";
import { STORAGE_KEYS, USER_ROLES } from "src/constants/keywords";
import { axiosPost } from "src/services/axiosHelper";
import { API_ROUTER } from "src/services/apiRouter";
import axiosInstance from "src/utils/custom/axios";

const initialAuthState = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
};

//** Actions */

const handlers = {
    INITIALIZE: (state, action) => {
        const { isAuthenticated, user } = action.payload;

        return {
            ...state,
            isAuthenticated,
            isInitialized: true,
            user,
        };
    },
    LOGIN: (state, action) => {
        const { user } = action.payload;

        return {
            ...state,
            isAuthenticated: true,
            user,
        };
    },
    LOGOUT: (state) => ({
        ...state,
        isAuthenticated: false,
        user: null,
    }),
    REGISTER: (state, action) => {
        const { user } = action.payload;

        return {
            ...state,
            isAuthenticated: true,
            user,
        };
    },
};

//** Context Init */

const reducer = (state, action) =>
    handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext({
    ...initialAuthState,
    method: "JWT",
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    register: () => Promise.resolve(),
    verifyOtp: () => Promise.resolve(),
});

//** PROVIDER */

export const AuthProvider = (props) => {
    const { children } = props;
    const [state, dispatch] = useReducer(reducer, initialAuthState);

    const setSession = (accessToken, refreshToken, user) => {
        if (accessToken) {
            saveData(STORAGE_KEYS.AUTH_TOKEN, accessToken);
            saveData(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
            saveData(STORAGE_KEYS.AUTH, user);
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        } else {
            removeAll();
            delete axiosInstance.defaults.headers.common.Authorization;
        }
    };

    //** Effects */

    useEffect(() => {
        const initialize = async () => {
            try {
                const accessToken = getData(STORAGE_KEYS.AUTH_TOKEN);
                const localUser = getData(STORAGE_KEYS.AUTH);

                if (accessToken && localUser?.email) {
                    setSession(accessToken, localUser);
                    dispatch({
                        type: "INITIALIZE",
                        payload: {
                            isAuthenticated: true,
                            user: localUser,
                        },
                    });
                } else {
                    dispatch({
                        type: "INITIALIZE",
                        payload: {
                            isAuthenticated: false,
                            user: null,
                        },
                    });
                }
            } catch (err) {
                console.error(err);
                dispatch({
                    type: "INITIALIZE",
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                });
            }
        };

        initialize();
    }, []);

    //** Handlers */

    const login = async (email, password) => {
        return new Promise(async (resolve) => {
            try {
                const { data, status, message } = await axiosPost(
                    API_ROUTER.LOGIN,
                    {
                        email,
                        password,
                    },
                );
                if (status) {
                    const { user, accessToken, refreshToken } = data;
                    // if (user?.role && [USER_ROLES.ADMIN].includes(user.role)) {

                    setSession(accessToken, refreshToken, user);

                    dispatch({
                        type: "LOGIN",
                        payload: {
                            user: user,
                        },
                    });

                    resolve({
                        status: true,
                        data: {
                            user: user,
                        },
                        message: "Login successful",
                    });
                    // } else {
                    //     resolve({
                    //         status: false,
                    //         data: null,
                    //         message: "You are not authorized to login",
                    //     });
                    // }
                } else {
                    resolve({
                        status: false,
                        data: null,
                        message: message || "Something went wrong",
                    });
                }
            } catch (error) {
                console.error("🚀 ~ login error:", error);
                resolve({
                    status: false,
                    data: null,
                    message: "Something went wrong during login",
                });
            }
        });
    };

    const verifyOtp = async (otp) => {
        return new Promise(async (resolve) => {
            try {
                const { status, data, message } = await axiosPost(
                    API_ROUTER.VERIFY_CODE,
                    { otp },
                );
                if (status) {
                    // if (
                    //     data?.permission &&
                    //     [USER_ROLES.SUPER_USER, USER_ROLES.STAFF].includes(
                    //         data?.permission,
                    //     )
                    // ) {
                    //     let role = getRole({ role: data?.permission });
                    //     let user = {
                    //         ...data?.user,
                    //         role,
                    //     };
                    //     setSession(data?.token, user);
                    //     dispatch({
                    //         type: "LOGIN",
                    //         payload: {
                    //             user: user,
                    //         },
                    //     });
                    //     resolve({ status: true, data });
                    // } else {
                    //     resolve({
                    //         status: false,
                    //         data,
                    //         message: "You are not authorized to login",
                    //     });
                    // }
                } else {
                    resolve({
                        status: false,
                        data: "",
                        message: message || "Something went wrong",
                    });
                    dispatch({ type: "LOGOUT" });
                }
            } catch (error) {
                resolve({ status: false, data: "" });
            }
        });
    };

    const logout = async () => {
        return new Promise(async (resolve) => {
            try {
                const { data, status } = await axiosPost(API_ROUTER.LOGOUT);
                removeData(STORAGE_KEYS.AUTH_TOKEN);
                removeData(STORAGE_KEYS.AUTH);
                delete axiosInstance.defaults.headers.common.Authorization;
                if (status) {
                    resolve({ status: true, data });
                } else {
                    resolve({
                        status: false,
                        data: "",
                    });
                }
                dispatch({ type: "LOGOUT" });
            } catch (error) {}
        });
    };

    const register = async (username, email, password) => {
        return new Promise(async (resolve) => {
            try {
                const { data, status, message } = await axiosPost(
                    API_ROUTER.REGISTER,
                    {
                        username,
                        email,
                        password,
                    },
                );
                if (status) {
                    resolve({ status: true, data, message });
                } else {
                    resolve({
                        status: false,
                        data: null,
                        message,
                    });
                }
            } catch (error) {
                console.log("🚀 ~ Register ~ error:", error);
            }
        });
        dispatch({
            type: "REGISTER",
            payload: {
                user,
            },
        });
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: "JWT",
                login,
                logout,
                register,
                verifyOtp,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const AuthConsumer = AuthContext.Consumer;

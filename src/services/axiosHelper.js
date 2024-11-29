import { STORAGE_KEYS } from "src/constants/keywords";
import axiosInstance from "src/utils/custom/axios";
import { removeAll, removeData } from "src/utils/custom/storage";

export const axiosPost = async (
    url,
    payload,
    contentType = "application/json",
) => {
    let response = {};
    try {
        const result = await axiosInstance.post(url, payload, {
            headers: {
                "Content-Type": contentType,
            },
        });
        const { data, message, success, statusCode } = result.data;
        response.data = data;
        response.status = [200, 201].includes(statusCode) || success;
        response.message = message;
    } catch (e) {
        console.error("🚀 ~axiosPost e:", e);
        response.status = false;
        response.message =
            e?.response?.data?.message || "An unknown error occurred.";
        response.data = e;
    }
    return response;
};

export const axiosGet = async (
    url,
    params = {},
    contentType = "application/json",
) => {
    let response = {};
    try {
        const result = await axiosInstance.get(url, {
            headers: {
                "Content-Type": contentType,
            },
            params,
        });
        const { data, message, success, statusCode } = result.data;
        response.data = data;
        response.status = [200, 201].includes(statusCode) || success;
    } catch (e) {
        if (e.response?.status === 401) {
            removeData(STORAGE_KEYS.AUTH_TOKEN);
            removeData(STORAGE_KEYS.AUTH);
            window.location.href = "/";
        }
        console.error("🚀 ~axiosGet e:", e);
        response.status = false;
        response.message = e?.response?.data?.message || "something went wrong";
        response.data = e;
    }
    return response;
};

export const axiosPatch = async (
    url,
    payload,
    contentType = "application/json",
) => {
    let response = {};
    try {
        const result = await axiosInstance.patch(url, payload, {
            headers: {
                "Content-Type": contentType,
            },
        });
        const { data, message, success, statusCode } = result.data;
        response.data = data;
        response.status = success;
    } catch (e) {
        console.error("🚀 ~axiosPatch e:", e);
        response.status = false;
        response.message = e?.response?.data?.message || "something went wrong";
        response.data = e;
    }
    return response;
};

export const axiosPut = async (
    url,
    payload,
    contentType = "application/json",
) => {
    let response = {};
    try {
        const result = await axiosInstance.put(url, payload, {
            headers: {
                "Content-Type": contentType,
            },
        });
        const { data, message, success, statusCode } = result.data;
        response.data = data;
        response.status = success;
    } catch (e) {
        console.error("🚀 ~axiosPut e:", e);
        response.status = false;
        response.message = e?.response?.data?.message || "something went wrong";
        response.data = e;
    }
    return response;
};

export const axiosDelete = async (
    url,
    payload,
    contentType = "application/json",
) => {
    let response = {};
    try {
        const result = await axiosInstance.delete(url, {
            headers: {
                "Content-Type": contentType,
            },
        });
        const { data, message, success, statusCode } = result.data;
        response = data;
        response.status = success;
    } catch (e) {
        console.error("🚀 ~axiosDelete e:", e);
        response.status = false;
        response.message = e?.response?.data?.message || "something went wrong";
        response.data = e;
    }
    return response;
};

import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetFiltersService, GetSubjectsService } from "src/services/services";

export const getFiltersAction = createAsyncThunk(
    "globalSlice/getFiltersAction",
    async (payload, { rejectWithValue }) => {
        try {
            const { data, status, message } = await GetFiltersService();
            return data || {};
        } catch (err) {
            if (err instanceof AxiosError) {
                return rejectWithValue(err?.response?.data?.message);
            }
            return rejectWithValue(err.message);
        }
    },
);

export const getSubjectsAction = createAsyncThunk(
    "globalSlice/getSubjectsAction",
    async (payload, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const { name, standard, board } = state.global.currentFilter;
            let query = { name, standard, board };
            const { data, status, message } = await GetSubjectsService(query);
            return data?.data || [];
        } catch (err) {
            if (err instanceof AxiosError) {
                return rejectWithValue(err?.response?.data?.message);
            }
            return rejectWithValue(err.message);
        }
    },
);

// export const loginAction = createAsyncThunk(
//     "globalSlice/loginAction",
//     async (payload, { rejectWithValue }) => {
//         try {
//             const { data, status, message } = await LoginUser(payload);
//             return { data, status, message };
//         } catch (err) {
//             toast.error(data?.data?.message);
//             if (err instanceof AxiosError) {
//                 return rejectWithValue(err?.response?.data?.detail);
//             }
//             return rejectWithValue(err.message);
//         }
//     },
// );

// export const authTokenAction = createAsyncThunk(
//     "globalSlice/authTokenAction",
//     async (payload, { rejectWithValue }) => {
//         try {
//             const { data, status, message } = await AuthToken(payload);
//             return { data, status, message };
//         } catch (err) {
//             toast.error(err?.response?.data?.message || err.message);
//             if (err instanceof AxiosError) {
//                 return rejectWithValue(err?.response?.data?.message);
//             }
//             return rejectWithValue(err.message);
//         }
//     },
// );

// export const authLinkAction = createAsyncThunk(
//     "globalSlice/authLinkAction",
//     async (payload, { rejectWithValue }) => {
//         try {
//             const { data, status, message } = await AuthLink(payload);
//             if (data?.access_token) {
//                 saveData("token", data);
//             }
//             return { data, status, message };
//         } catch (err) {
//             if (err instanceof AxiosError) {
//                 return rejectWithValue(err?.response?.data?.message);
//             }
//             return rejectWithValue(err.message);
//         }
//     },
// );

// export const logoutAction = createAsyncThunk(
//     "globalSlice/logoutAction",
//     async (payload, { rejectWithValue }) => {
//         try {
//             const { status, message } = await Logout(payload);
//             removeData("token");
//             window.location.href = "/";
//             return { status, message };
//         } catch (err) {
//             if (err instanceof AxiosError) {
//                 return rejectWithValue(err?.response?.data?.message);
//             }
//             return rejectWithValue(err.message);
//         }
//     },
// );
// export const logoutAllAction = createAsyncThunk(
//     "globalSlice/logoutAllAction",
//     async ({ rejectWithValue }) => {
//         try {
//             const { data, status, message } = await LogoutAll();
//             return { data, status, message };
//         } catch (err) {
//             if (err instanceof AxiosError) {
//                 return rejectWithValue(err?.response?.data?.message);
//             }
//             return rejectWithValue(err.message);
//         }
//     },
// );
// export const getUserAction = createAsyncThunk(
//     "globalSlice/getUserAction",
//     async (payload, { rejectWithValue }) => {
//         try {
//             const { data, status, message } = await GetUser(payload);
//             if (data?.roles === USER_ROLES.RIDER) {
//                 const riderRes = await GetRiderDetail(data?.id);
//                 if (riderRes?.status && riderRes.data) {
//                     data.riderDetail = riderRes.data;
//                 }
//             }
//             return { data, status, message };
//         } catch (err) {
//             if (err instanceof AxiosError) {
//                 return rejectWithValue(err?.response?.data?.message);
//             }
//             return rejectWithValue(err.message);
//         }
//     },
// );

// export const createUserAction = createAsyncThunk(
//     "user/createUserAction",
//     async (payload, { rejectWithValue }) => {
//         try {
//             const { data, status, message } = await CreateUser(
//                 JSON.stringify(payload),
//             );

//             return { data, status, message };
//         } catch (err) {
//             if (err instanceof AxiosError) {
//                 return rejectWithValue(err?.response?.data?.message);
//             }
//             return rejectWithValue(err.message);
//         }
//     },
// );
// export const updateUserAction = createAsyncThunk(
//     "user/updateUserAction",
//     async (payload, { rejectWithValue }) => {
//         try {
//             const { data, status, message } = await UpdateUser(payload);
//             return { data, status, message };
//         } catch (err) {
//             if (err instanceof AxiosError) {
//                 return rejectWithValue(err?.response?.data?.message);
//             }
//             return rejectWithValue(err.message);
//         }
//     },
// );

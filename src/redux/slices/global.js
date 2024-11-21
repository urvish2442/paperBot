import { createSlice } from "@reduxjs/toolkit";
import { getFiltersAction } from "../actions/action";

const initialState = {
    isLoading: false,
    filtersData: {},
};

const slice = createSlice({
    name: "globalSlice",
    initialState,
    reducers: {
        resetToInitialState(state) {
            return initialState;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getFiltersAction.pending, (state, { payload }) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getFiltersAction.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.filtersData = payload;
                state.error = null;
            })
            .addCase(getFiltersAction.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.error = payload;
            });
        // .addCase(registerAction.pending, (state, { payload }) => {
        //   state.isLoading = true;
        //   state.error = null;
        // })
        // .addCase(registerAction.fulfilled, (state, { payload }) => {
        //   state.isLoading = false;
        //   state.error = null;
        // })
        // .addCase(registerAction.rejected, (state, { payload }) => {
        //   state.isLoading = false;
        //   state.error = payload;
        // })
        // .addCase(loginAction.pending, (state, { payload }) => {
        //     state.isLoading = true;
        //     state.error = null;
        // })
        // .addCase(loginAction.fulfilled, (state, { payload }) => {
        //     state.isLoading = false;
        //     state.error = null;
        // })
        // .addCase(loginAction.rejected, (state, { payload }) => {
        //     state.isLoading = false;
        //     state.error = payload;
        // })
        // .addCase(getUserAction.pending, (state, { payload }) => {
        //     state.isLoading = true;
        //     state.error = null;
        // })
        // .addCase(getUserAction.fulfilled, (state, { payload }) => {
        //     state.isLoading = false;
        //     state.userData = payload?.data || {};
        //     state.error = null;
        // })
        // .addCase(getUserAction.rejected, (state, { payload }) => {
        //     state.isLoading = false;
        //     state.error = payload;
        // })
        // .addCase(logoutAction.pending, (state, { payload }) => {
        //     state.isLoading = true;
        //     state.error = null;
        // })
        // .addCase(logoutAction.fulfilled, (state, { payload }) => {
        //     return initialState;
        // })
        // .addCase(logoutAction.rejected, (state, { payload }) => {
        //     state.isLoading = false;
        //     state.error = payload;
        // })

        // .addCase(forgotPasswordAction.pending, (state, { payload }) => {
        //   state.isLoading = true;
        //   state.error = null;
        // })
        // .addCase(forgotPasswordAction.fulfilled, (state, { payload }) => {
        //   state.isLoading = false;
        //   state.error = null;
        // })
        // .addCase(forgotPasswordAction.rejected, (state, { payload }) => {
        //   state.isLoading = false;
        //   state.error = payload;
        // })
        // .addCase(resetPasswordAction.pending, (state, { payload }) => {
        //   state.isLoading = true;
        //   state.error = null;
        // })
        // .addCase(resetPasswordAction.fulfilled, (state, { payload }) => {
        //   state.isLoading = false;
        //   state.error = null;
        // })
        // .addCase(resetPasswordAction.rejected, (state, { payload }) => {
        //   state.isLoading = false;
        //   state.error = payload;
        // });
    },
});

export const { reducer } = slice;
export const globalState = (state) => state.global;
export const { resetToInitialState } = slice.actions;
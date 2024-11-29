import { useEffect, useReducer, useState } from "react";
import { API_ROUTER } from "src/services/apiRouter";
import { axiosGet, axiosPatch, axiosPost } from "src/services/axiosHelper";
import useToaster from "./useToaster";
import { TOAST_ALERTS, TOAST_TYPES, USER_ROLES } from "src/constants/keywords";
import { useAuth } from "./useAuth";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "src/redux/store";
import { globalState } from "src/redux/slices/global";

const STATE = {
    STARTLOADING: "STARTLOADING",
    STOPLOADING: "STOPLOADING",
    STOREDATA: "STOREDATA",
    PAGECHANGE: "PAGECHANGE",
    LIMITCHANGE: "LIMITCHANGE",
    FILTERCHANGE: "FILTERCHANGE",
    SEARCH: "SERACH",
    SORT: "SORT",
    ORDERCHANGE: "ORDERCHANGE",
};

export const useCreators = () => {
    const initialState = {
        loading: false,
        items: [],
        count: 0,
        page: 1,
        page_size: 10,
        state: null,
        hasMore: false,
        payload: {
            search: null,
            is_approved: null,
            user__is_active: "true",
            ordering: null,
        },
    };

    const reducer = (state, { type, payload }) => {
        switch (type) {
            case STATE.STARTLOADING:
                return { ...state, loading: true, state: null };
            case STATE.STOPLOADING:
                return { ...state, loading: false, state: null };
            case STATE.STOREDATA:
                return {
                    ...state,
                    items: payload.items,
                    count: payload.count,
                    hasMore: payload.hasMore,
                    loading: false,
                };
            case STATE.PAGECHANGE:
                return {
                    ...state,
                    page: payload.page,
                    state: STATE.PAGECHANGE,
                };
            case STATE.LIMITCHANGE:
                return {
                    ...state,
                    page_size: payload.page_size,
                    page: payload.page,
                    state: STATE.LIMITCHANGE,
                };
            case STATE.SEARCH:
                return {
                    ...state,
                    payload: { ...state.payload, search: payload.search },
                    page: 1,
                    state: STATE.SEARCH,
                };
            case STATE.FILTERCHANGE:
                return {
                    ...state,
                    payload: {
                        ...state.payload,
                        [payload.key]: payload.value,
                    },
                    page: 1,
                    state: STATE.FILTERCHANGE,
                };
            case STATE.SORT:
                return {
                    ...state,
                    payload: {
                        ...state.payload,
                        ordering: payload.ordering,
                    },
                    page: 1,
                    state: STATE.SORT,
                };

            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    //** Fetch Function */

    const getData = async () => {
        try {
            dispatch({ type: STATE.STARTLOADING });

            const query = {
                ...state.payload,
                page: state.page,
                page_size: state.page_size,
            };

            const { data } = await axiosGet(API_ROUTER.GET_CREATORS, query);

            dispatch({
                type: STATE.STOREDATA,
                payload: {
                    items: data.results || [],
                    count: data.count || 0,
                    hasMore:
                        Math.ceil(data?.count / state.page_size) > state.page,
                },
            });
        } catch (error) {
            dispatch({
                type: STATE.STOREDATA,
                payload: { items: [], count: 0 },
            });
        }
    };

    //** Effects */

    useEffect(() => {
        if (!state.state) return;
        let timer;
        if (state.state === STATE.SEARCH) {
            timer = setTimeout(() => {
                getData();
            }, 500);
        } else {
            getData();
        }
        return () => clearTimeout(timer);
    }, [state]);

    useEffect(() => {
        getData();
    }, []);

    //** Handlers */

    const handleQueryChange = (event) => {
        const search = event.target.value || null;
        dispatch({ type: STATE.SEARCH, payload: { search } });
    };

    const handlePageChange = (_event, newPage) => {
        dispatch({ type: STATE.PAGECHANGE, payload: { page: newPage + 1 } });
    };

    const handleLimitChange = (event) => {
        const newPageSize = parseInt(event.target.value, 10);
        if (!newPageSize || newPageSize <= 0) {
            console.error("Invalid page size");
            return;
        }

        const page = Math.min(
            state.page,
            Math.ceil(state.count / newPageSize) || 1,
        );
        dispatch({
            type: STATE.LIMITCHANGE,
            payload: { page_size: newPageSize, page },
        });
    };

    const handleFilterChange = (key, value) => {
        const newValue = value === "all" ? null : value;
        dispatch({
            type: STATE.FILTERCHANGE,
            payload: { key, value: newValue },
        });
    };

    const handleSort = (column) => {
        dispatch({
            type: STATE.SORT,
            payload: {
                ordering:
                    state.payload.ordering === column ? `-${column}` : column,
            },
        });
    };

    return {
        ...state,
        handleQueryChange,
        handlePageChange,
        handleLimitChange,
        handleFilterChange,
        handleSort,
    };
};

export const useSubjects = () => {
    const { toaster } = useToaster();
    const { user } = useAuth();
    const { currentFilter } = useSelector(globalState);

    const initialState = {
        loading: false,
        items: [],
        count: 0,
        page: 1,
        limit: 10,
        state: null,
        hasMore: false,
        payload: {
            search: null,
            board: null,
            name: null,
            medium: null,
            standard: null,
            isActive: user?.role === USER_ROLES.ADMIN ? null : true,
            sortBy: null,
        },
    };

    const reducer = (state, { type, payload }) => {
        switch (type) {
            case STATE.STARTLOADING:
                return { ...state, loading: true, state: null };
            case STATE.STOPLOADING:
                return { ...state, loading: false, state: null };
            case STATE.STOREDATA:
                return {
                    ...state,
                    items: payload.items,
                    count: payload.count,
                    hasMore: payload.hasMore,
                    loading: false,
                };
            case STATE.PAGECHANGE:
                return {
                    ...state,
                    page: payload.page,
                    state: STATE.PAGECHANGE,
                };
            case STATE.LIMITCHANGE:
                return {
                    ...state,
                    limit: payload.limit,
                    page: payload.page,
                    state: STATE.LIMITCHANGE,
                };
            case STATE.SEARCH:
                return {
                    ...state,
                    payload: { ...state.payload, search: payload.search },
                    page: 1,
                    state: STATE.SEARCH,
                };
            case STATE.FILTERCHANGE:
                return {
                    ...state,
                    payload: {
                        ...state.payload,
                        ...payload,
                    },
                    page: 1,
                    state: STATE.FILTERCHANGE,
                };
            case STATE.SORT:
                return {
                    ...state,
                    payload: {
                        ...state.payload,
                        sortBy: payload.sortBy,
                    },
                    page: 1,
                    state: STATE.SORT,
                };

            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    //** Fetch Function */

    const getData = async () => {
        try {
            dispatch({ type: STATE.STARTLOADING });

            const query = {
                ...state.payload,
                page: state.page,
                limit: state.limit,
            };

            const { data } = await axiosGet(API_ROUTER.GET_SUBJECTS, query);

            dispatch({
                type: STATE.STOREDATA,
                payload: {
                    items: data?.data || [],
                    count: data?.count || 0,
                    hasMore: data?.hasNextPage || false,
                },
            });
        } catch (error) {
            dispatch({
                type: STATE.STOREDATA,
                payload: { items: [], count: 0 },
            });
        }
    };

    //** Effects */

    useEffect(() => {
        if (!state.state) return;
        let timer;
        if (state.state === STATE.SEARCH) {
            timer = setTimeout(() => {
                getData();
            }, 500);
        } else {
            getData();
        }
        return () => clearTimeout(timer);
    }, [state]);

    useEffect(() => {
        getData();
    }, []);

    //** Handlers */

    const handleQueryChange = (event) => {
        const search = event.target.value || null;
        dispatch({ type: STATE.SEARCH, payload: { search } });
    };

    const handlePageChange = (_event, newPage) => {
        dispatch({ type: STATE.PAGECHANGE, payload: { page: newPage + 1 } });
    };

    const handleLimitChange = (event) => {
        const newPageSize = parseInt(event.target.value, 10);
        if (!newPageSize || newPageSize <= 0) {
            console.error("Invalid page size");
            return;
        }

        const page = Math.min(
            state.page,
            Math.ceil(state.count / newPageSize) || 1,
        );
        dispatch({
            type: STATE.LIMITCHANGE,
            payload: { limit: newPageSize, page },
        });
    };

    useEffect(() => {
        dispatch({
            type: STATE.FILTERCHANGE,
            payload: {
                ...currentFilter,
            },
        });
    }, [currentFilter]);

    const handleSort = (column) => {
        dispatch({
            type: STATE.SORT,
            payload: {
                sortBy: state.payload.sortBy === column ? `-${column}` : column,
            },
        });
    };
    const [currentItem, setCurrentItem] = useState(null);
    const handleOpenModal = (item) => {
        if (!item) return;
        setCurrentItem(item);
    };

    const handleCloseModal = () => {
        setCurrentItem(null);
    };
    const formik = useFormik({
        initialValues: {
            units:
                currentItem?.units?.length > 0
                    ? currentItem.units
                    : [{ number: 1, name: "" }], // Set existing units or default
        },
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            units: Yup.array().of(
                Yup.object().shape({
                    number: Yup.number()
                        .required("Number is required")
                        .positive("Number must be positive")
                        .integer("Number must be an integer"),
                    name: Yup.string()
                        .max(255, "Name must be at most 255 characters")
                        .required("Name is required"),
                }),
            ),
        }),
        onSubmit: async (values, { resetForm, setStatus, setSubmitting }) => {
            try {
                const { data, status, message } = await axiosPost(
                    API_ROUTER.UPDATE_SUBJECT_UNITS(currentItem._id),
                    values,
                );
                if (status) {
                    resetForm();
                    setCurrentItem(null);
                    getData();
                    setStatus({ success: true });
                    setSubmitting(false);
                    toaster(
                        TOAST_TYPES.SUCCESS,
                        TOAST_ALERTS.UNITS_UPDATE_SUCCESS,
                    );
                } else {
                    setStatus({ success: false });
                    setSubmitting(false);
                    toaster(
                        TOAST_TYPES.ERROR,
                        message || TOAST_ALERTS.GENERAL_ERROR,
                    );
                }
            } catch (error) {
                console.error(error);
                setStatus({ success: false });
                setSubmitting(false);
                toaster(
                    TOAST_TYPES.ERROR,
                    message || TOAST_ALERTS.GENERAL_ERROR,
                );
            }
        },
    });

    const toggleSubjectStatus = async (id, isActive) => {
        if (!id) return;
        const payload = { isActive: !isActive };
        try {
            const { data, status, message } = await axiosPatch(
                API_ROUTER.UPDATE_SUBJECT_STATUS(id),
                payload,
            );
            if (status) {
                getData();
            }
            toaster(
                status ? TOAST_TYPES.SUCCESS : TOAST_TYPES.ERROR,
                status
                    ? TOAST_ALERTS.SUBJECT_UPDATE_SUCCESS
                    : message || TOAST_ALERTS.GENERAL_ERROR,
            );
        } catch (error) {
            console.error(error);
        }
    };

    return {
        ...state,
        currentItem,
        formik,
        handleQueryChange,
        handlePageChange,
        handleLimitChange,
        // handleFilterChange,
        handleSort,
        toggleSubjectStatus,
        handleOpenModal,
        handleCloseModal,
    };
};

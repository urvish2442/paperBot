import { useEffect, useReducer } from "react";
import { API_ROUTER } from "src/services/apiRouter";
import { axiosGet } from "src/services/axiosHelper";

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

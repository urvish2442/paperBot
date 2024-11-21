import {
    useDispatch as useReduxDispatch,
    useSelector as useReduxSelector,
} from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: "root",
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.ENVIRONMENT === "development",
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore actions from redux-persist that are non-serializable
                ignoredActions: ["persist/PERSIST"],
                ignoredPaths: ["register"],
            },
        }),
});

export const persistor = persistStore(store);

export const useSelector = useReduxSelector;

export const useDispatch = () => useReduxDispatch();

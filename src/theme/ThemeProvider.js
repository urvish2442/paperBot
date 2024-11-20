import { useState, createContext, useEffect } from "react";
import { ThemeProvider } from "@mui/material";
import { themeCreator } from "./base";
import { StylesProvider } from "@mui/styles";
import { getData, saveData } from "src/utils/custom/storage";
import { STORAGE_KEYS } from "src/constants/keywords";

export const ThemeContext = createContext((_themeName) => {});

const ThemeProviderWrapper = (props) => {
    const [themeName, _setThemeName] = useState("NebulaFighterTheme");

    useEffect(() => {
        const curThemeName =
            getData(STORAGE_KEYS.APP_THEME) || "NebulaFighterTheme";
        // window.localStorage.getItem("appTheme") || "NebulaFighterTheme";
        _setThemeName(curThemeName);
    }, []);

    const theme = themeCreator(themeName);
    const setThemeName = (themeName) => {
        saveData(STORAGE_KEYS.APP_THEME, themeName);
        // window.localStorage.setItem("appTheme", themeName);
        _setThemeName(themeName);
    };

    return (
        <StylesProvider injectFirst>
            <ThemeContext.Provider value={setThemeName}>
                <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
            </ThemeContext.Provider>
        </StylesProvider>
    );
};

export default ThemeProviderWrapper;

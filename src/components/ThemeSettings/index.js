import React, { useContext, useEffect, useState } from "react";
import { Typography, Stack, Box, Tooltip } from "@mui/material";
import { ThemeContext } from "src/theme/ThemeProvider";
import CheckTwoToneIcon from "@mui/icons-material/CheckTwoTone";
import { getData } from "src/utils/custom/storage";
import { STORAGE_KEYS } from "src/constants/keywords";
import {
    ThemeToggleWrapper,
    ButtonWrapper,
    ColorSchemeWrapper,
    CheckSelected,
} from "./ThemeStyled";

const ThemeSettings = ({ closeMenu = () => {} }) => {
    const setThemeName = useContext(ThemeContext);

    useEffect(() => {
        const curThemeName =
            getData(STORAGE_KEYS.APP_THEME) || "NebulaFighterTheme";
        setTheme(curThemeName);
    }, []);

    const [theme, setTheme] = useState("NebulaFighterTheme");

    const changeTheme = (theme) => {
        setTheme(theme);
        setThemeName(theme);
        closeMenu();
    };

    const themeGroups = [
        {
            title: "Theme color schemes",
            themes: [
                {
                    key: "GreyGooseTheme",
                    label: "Grey Goose",
                    className: "greyGoose",
                },
                {
                    key: "PurpleFlowTheme",
                    label: "Purple Flow",
                    className: "purpleFlow",
                },
                {
                    key: "NebulaFighterTheme",
                    label: "Nebula Fighter",
                    className: "nebulaFighter",
                },
                {
                    key: "GreenFieldsTheme",
                    label: "Green Fields",
                    className: "greenFields",
                },
            ],
        },
    ];

    return (
        <>
            {themeGroups.map((group, i) => (
                <React.Fragment key={group.title}>
                    <ThemeToggleWrapper>
                        {/* <Typography
                            sx={{
                                mt: 1,
                                mb: 3,
                                textAlign: "center",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                            }}
                            variant="body1"
                        >
                            {group.title}
                        </Typography> */}

                        <Stack alignItems="center" spacing={2}>
                            {group.themes.map(({ key, label, className }) => (
                                <Tooltip
                                    key={key}
                                    placement="left"
                                    title={label}
                                    arrow
                                >
                                    <ButtonWrapper
                                        className={
                                            theme === key ? "active" : ""
                                        }
                                        onClick={() => changeTheme(key)}
                                    >
                                        {theme === key && (
                                            <CheckSelected>
                                                <CheckTwoToneIcon />
                                            </CheckSelected>
                                        )}
                                        <ColorSchemeWrapper
                                            className={`colorSchemeWrapper ${className}`}
                                        >
                                            <Box className="primary" />
                                            <Box className="secondary" />
                                        </ColorSchemeWrapper>
                                    </ButtonWrapper>
                                </Tooltip>
                            ))}
                        </Stack>
                    </ThemeToggleWrapper>
                </React.Fragment>
            ))}
        </>
    );
};

export default ThemeSettings;

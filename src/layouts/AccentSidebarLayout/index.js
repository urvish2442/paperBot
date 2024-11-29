import { Box, useTheme } from "@mui/material";
import PropTypes from "prop-types";

import ThemeSettings from "src/components/ThemeSettings";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getFiltersAction, getSubjectsAction } from "src/redux/actions/action";
import { useSelector } from "react-redux";
import { globalState } from "src/redux/slices/global";

const AccentSidebarLayout = ({ children }) => {
    const theme = useTheme();
    const { currentFilter } = useSelector(globalState);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getFiltersAction());
    }, []);

    useEffect(() => {
        dispatch(getSubjectsAction(currentFilter));
    }, [currentFilter]);

    return (
        <>
            <Header />
            <Sidebar />
            <Box
                sx={{
                    position: "relative",
                    zIndex: 5,
                    flex: 1,
                    display: "flex",
                    pt: `${theme.header.height}`,
                    [theme.breakpoints.up("lg")]: {
                        pl: `${theme.sidebar.width}`,
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flex: 1,
                        flexDirection: "column",
                        width: "100%",
                    }}
                >
                    <Box flexGrow={1}>{children}</Box>
                </Box>
                <ThemeSettings />
            </Box>
        </>
    );
};

AccentSidebarLayout.propTypes = {
    children: PropTypes.node,
};

export default AccentSidebarLayout;

import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
    LABEL_FOR_BOARDS,
    LABEL_FOR_STANDARDS,
    LABEL_FOR_SUBJECTS,
} from "src/constants/keywords";
import { globalState, setCurrentFilter } from "src/redux/slices/global";
import { DISABLED_GLOBAL_FILTER_PATH } from "src/routes/paths";

const GlobalFilters = () => {
    const dispatch = useDispatch();
    const { pathname } = useRouter();
    const { currentFilter, filtersData, subjectFiltersData } =
        useSelector(globalState);

    useEffect(() => {
        console.log("🚀 ~ GlobalFilters ~ currentFilter:", currentFilter);
    }, [currentFilter]);

    const isDisabled = useMemo(() => {
        return DISABLED_GLOBAL_FILTER_PATH.includes(pathname);
    }, [pathname]);

    const handleFilterChange = (key, value) => {
        const newValue = value === "all" ? null : value;
        dispatch(
            setCurrentFilter({
                [key]: newValue,
                subject: null,
                type: null,
                unit: null,
            }),
        );
    };
    return (
        <>
            <Box
                py={2}
                display="flex"
                alignItems="center"
                flexDirection={{ xs: "row", sm: "row" }}
                justifyContent={{
                    xs: "flex-start",
                    sm: "flex-end",
                }}
                pb={3}
                gap={{ sm: 2, xs: 1 }}
            >
                <FormControl size="small" variant="outlined" sx={{ width: 90 }}>
                    <InputLabel>Board</InputLabel>
                    <Select
                        value={
                            currentFilter.board === null
                                ? "all"
                                : currentFilter.board
                        }
                        onChange={(e) =>
                            handleFilterChange("board", e.target.value)
                        }
                        label="Board"
                        disabled={isDisabled}
                    >
                        <MenuItem value="all">All</MenuItem>
                        {filtersData?.boards?.map((item) => (
                            <MenuItem key={item} value={item}>
                                {LABEL_FOR_BOARDS[item] || item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="small" variant="outlined" sx={{ width: 90 }}>
                    <InputLabel>Standard</InputLabel>
                    <Select
                        value={
                            currentFilter.standard === null
                                ? "all"
                                : currentFilter.standard
                        }
                        onChange={(e) =>
                            handleFilterChange("standard", e.target.value)
                        }
                        label="Standard"
                        disabled={isDisabled}
                    >
                        <MenuItem value="all">All</MenuItem>
                        {filtersData?.standards?.map((item) => (
                            <MenuItem key={item} value={item}>
                                {LABEL_FOR_STANDARDS[item] || item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {/* Subject */}
                <FormControl
                    size="small"
                    variant="outlined"
                    sx={{
                        width: 90,
                        display: { xs: "none", sm: "block" },
                    }}
                >
                    <InputLabel>Subject</InputLabel>
                    <Select
                        value={
                            currentFilter.name === null
                                ? "all"
                                : currentFilter.name
                        }
                        onChange={(e) =>
                            handleFilterChange("name", e.target.value)
                        }
                        label="Subject"
                        disabled={isDisabled}
                    >
                        <MenuItem value="all">All</MenuItem>
                        {filtersData?.subjects?.map((item) => (
                            <MenuItem key={item} value={item}>
                                {LABEL_FOR_SUBJECTS[item] || item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </>
    );
};

export default GlobalFilters;

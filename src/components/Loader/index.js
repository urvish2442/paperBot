import { Box, CircularProgress } from "@mui/material";

function Loader({ size = 64, defaultLoader = true, height = "auto" }) {
    const loaderProps = {
        size,
        disableShrink: true,
        thickness: 3,
    };
    if (defaultLoader) {
        return (
            <Box
                sx={{
                    // position: "fixed",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                }}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <CircularProgress {...loaderProps} />
            </Box>
        );
    }

    return (
        <>
            <Box
                sx={{
                    width: "100%",
                    height: height,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 2,
                }}
            >
                <CircularProgress {...loaderProps} />
            </Box>
        </>
    );
}

export default Loader;

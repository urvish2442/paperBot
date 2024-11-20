import { IconButton, Slide } from "@mui/material";
import { useSnackbar } from "notistack";
import CloseIcon from "@mui/icons-material/Close";

const useToaster = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    // VARIANT: success, info, error, warning

    const toaster = (variant, message) => {
        enqueueSnackbar(message, {
            variant,
            anchorOrigin: {
                vertical: "top",
                horizontal: "right",
            },
            autoHideDuration: 4000,
            TransitionComponent: Slide,
            persist: false,
            action: (key) => (
                <IconButton
                    aria-label="close"
                    color="inherit"
                    onClick={() => closeSnackbar(key)}
                >
                    <CloseIcon />
                </IconButton>
            ),
        });
    };

    return { toaster };
};

export default useToaster;

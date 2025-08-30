import { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Button,
} from "@mui/material";

// Add this above your PaperMain component
const EditHeaderModal = ({
    open,
    handleClose,
    headerData,
    setHeaderData,
    onSave,
    isSubmitting,
}) => {
    const [localHeader, setLocalHeader] = useState(headerData);

    useEffect(() => {
        setLocalHeader(headerData);
    }, [headerData, open]);

    const handleChange = (e) => {
        setLocalHeader({
            ...localHeader,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(localHeader);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h4" gutterBottom>
                    Edit Paper Header
                </Typography>
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    <TextField
                        margin="normal"
                        label="Trust Name"
                        name="trustName"
                        fullWidth
                        value={localHeader.trustName}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        label="School Name"
                        name="schoolName"
                        fullWidth
                        value={localHeader.schoolName}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        label="Hours"
                        name="hours"
                        fullWidth
                        value={localHeader.hours}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        label="Marks"
                        name="marks"
                        type="number"
                        fullWidth
                        value={localHeader.marks}
                        onChange={handleChange}
                        inputProps={{ min: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                    >
                        Save
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditHeaderModal;


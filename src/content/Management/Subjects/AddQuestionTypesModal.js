import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Grid,
    TextField,
    Button,
    IconButton,
    CircularProgress,
} from "@mui/material";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";

const AddQuestionTypesModal = ({
    currentQuestion = null,
    handleCloseTypeModal,
    formik,
}) => {
    return (
        <Dialog
            fullWidth
            maxWidth="md"
            open={!!currentQuestion}
            onClose={handleCloseTypeModal}
        >
            <DialogTitle>
                <Typography variant="h4" gutterBottom>
                    Add Question Types for{" "}
                    {currentQuestion?.model_name?.toUpperCase()}
                </Typography>
                <Typography variant="subtitle2">
                    Fill in the fields below to add/update question types.
                </Typography>
            </DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent dividers>
                    <Typography variant="h6">Add Question Types</Typography>
                    {formik.values.questionTypes.map((qt, index) => (
                        <Grid
                            container
                            spacing={2}
                            key={index}
                            alignItems="flex-start"
                            sx={{ mt: 1 }}
                        >
                            <Grid item xs={5}>
                                <TextField
                                    fullWidth
                                    label="Question Type Name"
                                    name={`questionTypes[${index}].name`}
                                    value={
                                        formik.values.questionTypes[index].name
                                    }
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.questionTypes?.[index]
                                            ?.name &&
                                        Boolean(
                                            formik.errors.questionTypes?.[index]
                                                ?.name,
                                        )
                                    }
                                    helperText={
                                        formik.touched.questionTypes?.[index]
                                            ?.name &&
                                        formik.errors.questionTypes?.[index]
                                            ?.name
                                    }
                                    variant="outlined"
                                    FormHelperTextProps={{
                                        style: { minHeight: "24px" },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    name={`questionTypes[${index}].description`}
                                    value={
                                        formik.values.questionTypes[index]
                                            .description
                                    }
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.questionTypes?.[index]
                                            ?.description &&
                                        Boolean(
                                            formik.errors.questionTypes?.[index]
                                                ?.description,
                                        )
                                    }
                                    helperText={
                                        formik.touched.questionTypes?.[index]
                                            ?.description &&
                                        formik.errors.questionTypes?.[index]
                                            ?.description
                                    }
                                    variant="outlined"
                                    FormHelperTextProps={{
                                        style: { minHeight: "24px" },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton
                                    color="error"
                                    onClick={() => {
                                        const newTypes =
                                            formik.values.questionTypes.filter(
                                                (_, i) => i !== index,
                                            );
                                        formik.setFieldValue(
                                            "questionTypes",
                                            newTypes,
                                        );
                                    }}
                                    disabled={
                                        formik.values.questionTypes.length ===
                                            1 ||
                                        index <
                                            currentQuestion?.questionTypes
                                                ?.length
                                    }
                                >
                                    <DeleteTwoToneIcon />
                                </IconButton>
                                {/* <Tooltip title="Active" arrow>
                                    <Switch
                                        checked={
                                            formik.values.questionTypes[index]
                                                .isActive
                                        }
                                        onChange={formik.handleChange}
                                        name={`questionTypes[${index}].isActive`}
                                        color="primary"
                                        sx={{ ml: 1 }}
                                    />
                                </Tooltip> */}
                            </Grid>
                        </Grid>
                    ))}
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => {
                            formik.setFieldValue("questionTypes", [
                                ...formik.values.questionTypes,
                                { name: "", description: "" },
                            ]);
                        }}
                    >
                        Add Question Type
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseTypeModal} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={formik.isSubmitting}
                        startIcon={
                            formik.isSubmitting ? (
                                <CircularProgress size="1rem" />
                            ) : null
                        }
                        variant="contained"
                    >
                        Submit
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddQuestionTypesModal;

import { Box, Grid, Typography, Button, styled } from "@mui/material";
import { useTranslation } from "react-i18next";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import Link from "src/components/Link";
import { PATH_DASHBOARD } from "src/routes/paths";

const RootWrapper = styled(Box)(
    () => `
    flex: 1;
`,
);

function PageHeader() {
    const { t } = useTranslation();

    return (
        <RootWrapper>
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Box>
                            <Typography
                                variant="h3"
                                component="h3"
                                gutterBottom
                            >
                                {t("Add new Question")}
                            </Typography>
                            <Typography variant="subtitle2">
                                {t(
                                    "Fill in the fields below to create a new Question",
                                )}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item>
                    <Button
                        sx={{
                            mt: { xs: 2, sm: 0 },
                        }}
                        component={Link}
                        startIcon={<ArrowBackTwoToneIcon />}
                        href={PATH_DASHBOARD.questions.root}
                        variant="contained"
                    >
                        {t("Go back to all questions")}
                    </Button>
                </Grid>
            </Grid>
        </RootWrapper>
    );
}

export default PageHeader;

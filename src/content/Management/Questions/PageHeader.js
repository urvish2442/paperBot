import { useTranslation } from "react-i18next";
import Link from "src/components/Link";

import { Grid, Typography, Button } from "@mui/material";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { PATH_DASHBOARD } from "src/routes/paths";

function PageHeader() {
    const { t } = useTranslation();

    return (
        <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
                <Typography variant="h3" component="h3" gutterBottom>
                    {t("Questions")}
                </Typography>
                {/* <Typography variant="subtitle2">
                    {t(
                        "Use this page to manage your Subjects, the fast and easy way.",
                    )}
                </Typography> */}
            </Grid>
            <Grid item>
                <Button
                    sx={{
                        mt: { xs: 2, sm: 0 },
                    }}
                    component={Link}
                    href={PATH_DASHBOARD.questions.add}
                    variant="contained"
                    startIcon={<AddTwoToneIcon fontSize="small" />}
                >
                    {t("Create Question")}
                </Button>
            </Grid>
        </Grid>
    );
}

export default PageHeader;

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
            </Grid>
        </Grid>
    );
}

export default PageHeader;

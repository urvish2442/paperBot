import { Grid, Typography, Avatar, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

function PageHeader() {
    const { t } = useTranslation();
    const theme = useTheme();

    const user = {
        avatar: "/static/images/avatars/1.jpg",
        name: "Rachael Simons",
        jobtitle: "Lead Developer",
    };

    return (
        <Grid container alignItems="center">
            <Grid item>
                <Avatar
                    sx={{
                        mr: 2,
                        width: theme.spacing(8),
                        height: theme.spacing(8),
                    }}
                    variant="rounded"
                    alt={user.name}
                    src={user.avatar}
                />
            </Grid>
            <Grid item>
                <Typography variant="h3" component="h3" gutterBottom>
                    {t("Welcome")}, {user.name}!
                </Typography>
                <Typography variant="subtitle2">
                    {t("These are your analytics stats for today")},{" "}
                    <b>{format(new Date(), "MMMM dd yyyy")}</b>
                </Typography>
            </Grid>
        </Grid>
    );
}

export default PageHeader;

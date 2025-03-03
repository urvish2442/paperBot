import {
    Typography,
    Box,
    styled,
    Avatar,
    lighten,
    alpha,
    Stack,
    Divider,
    useTheme,
    Card,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import FlareTwoToneIcon from "@mui/icons-material/FlareTwoTone";

const AvatarPageTitle = styled(Avatar)(
    ({ theme }) => `
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      color: ${theme.colors.primary.main};
      margin-right: ${theme.spacing(2)};
      background: ${
          theme.palette.mode === "dark"
              ? theme.colors.alpha.trueWhite[10]
              : theme.colors.alpha.white[50]
      };
      box-shadow: ${
          theme.palette.mode === "dark"
              ? "0 1px 0 " +
                alpha(lighten(theme.colors.primary.main, 0.8), 0.2) +
                ", 0px 2px 4px -3px rgba(0, 0, 0, 0.3), 0px 5px 16px -4px rgba(0, 0, 0, .5)"
              : "0px 2px 4px -3px " +
                alpha(theme.colors.alpha.black[100], 0.4) +
                ", 0px 5px 16px -4px " +
                alpha(theme.colors.alpha.black[100], 0.2)
      };
`,
);

const DotLegend = styled("span")(
    ({ theme }) => `
    border-radius: 22px;
    width: ${theme.spacing(1.8)};
    height: ${theme.spacing(1.8)};
    display: inline-block;
    margin-right: ${theme.spacing(0.8)};
    border: ${theme.colors.alpha.white[100]} solid 2px;
`,
);

function PageHeader() {
    const { t } = useTranslation();
    const theme = useTheme();

    return (
        <Box
            display="flex"
            alignItems={{ xs: "stretch", md: "center" }}
            flexDirection={{ xs: "column", md: "row" }}
            justifyContent="space-between"
        >
            <Box display="flex" alignItems="center">
                <AvatarPageTitle variant="rounded">
                    <FlareTwoToneIcon fontSize="large" />
                </AvatarPageTitle>
                <Box>
                    <Typography variant="h3" component="h3" gutterBottom>
                        {t("Large Sparklines")}
                    </Typography>
                    <Typography variant="subtitle2">
                        {t(
                            "Take advantage of these extensive, easy to customize large sparklines component blocks",
                        )}
                    </Typography>
                </Box>
            </Box>
            <Card
                sx={{
                    mt: { xs: 3, lg: 0 },
                }}
            >
                <Stack
                    direction="row"
                    divider={
                        <Divider
                            sx={{
                                background: `${theme.colors.alpha.black[10]}`,
                            }}
                            orientation="vertical"
                            flexItem
                        />
                    }
                    justifyContent="space-around"
                    alignItems="center"
                    spacing={0}
                >
                    <Box px={3} py={2} textAlign="center">
                        <Typography gutterBottom variant="h4">
                            Tokyo
                        </Typography>
                        <Typography color="text.secondary" variant="h5">
                            {t("Version 3.1")}
                        </Typography>
                    </Box>
                    <Box px={3} py={2} textAlign="center">
                        <Typography
                            variant="h4"
                            fontWeight="normal"
                            color="text.secondary"
                            gutterBottom
                        >
                            {t("Components")}
                        </Typography>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <DotLegend
                                style={{
                                    animation: `pulse 1s infinite`,
                                    background: `${theme.colors.success.main}`,
                                }}
                            />
                            <Typography color="text.primary" variant="h4">
                                574
                            </Typography>
                        </Box>
                    </Box>
                </Stack>
            </Card>
        </Box>
    );
}

export default PageHeader;

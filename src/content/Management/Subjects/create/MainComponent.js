import React from "react";
import { useState } from "react";

import {
    TextField,
    Grid,
    CardHeader,
    Tab,
    Box,
    Tabs,
    Typography,
    Divider,
    FormControl,
    Checkbox,
    Tooltip,
    InputAdornment,
    FormControlLabel,
    IconButton,
    InputLabel,
    Select,
    Card,
    styled,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import HelpOutlineTwoToneIcon from "@mui/icons-material/HelpOutlineTwoTone";

const TabsContainerWrapper = styled(Box)(
    ({ theme }) => `
    background-color: ${theme.colors.alpha.black[5]};
    padding: ${theme.spacing(2)};
  `,
);

const MainComponent = () => {
    const { t } = useTranslation();

    return (
        <>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title={t("Subject Information")} />

                    <Divider />
                    <Box p={3}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    name="regular_price"
                                    variant="outlined"
                                    label={t("Subject Name")}
                                    placeholder={t("Regular price here ...")}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    name="sale_price"
                                    variant="outlined"
                                    label={t("Sale price")}
                                    placeholder={t("Sale price here ...")}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="tax_status">
                                        {t("Tax Status")}
                                    </InputLabel>
                                    <Select
                                        native
                                        label={t("Tax Status")}
                                        inputProps={{
                                            name: "tax_status",
                                        }}
                                    >
                                        <option aria-label="None" value="" />
                                        <option value={1}>
                                            {t("Taxable")}
                                        </option>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="tax_class">
                                        {t("Tax Class")}
                                    </InputLabel>
                                    <Select
                                        native
                                        label={t("Tax Class")}
                                        inputProps={{
                                            name: "tax_status",
                                        }}
                                    >
                                        <option aria-label="None" value="" />
                                        <option value={1}>
                                            {t("Standard")}
                                        </option>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box display="flex" alignItems="center">
                                    <TextField
                                        fullWidth
                                        name="sku"
                                        variant="outlined"
                                        label={t("SKU")}
                                        placeholder={t(
                                            "Stock quantity here ...",
                                        )}
                                    />
                                    <Tooltip
                                        arrow
                                        placement="top"
                                        title={t(
                                            "This field helps identify the current product stocks",
                                        )}
                                    >
                                        <IconButton
                                            size="small"
                                            sx={{
                                                ml: 1,
                                            }}
                                            color="primary"
                                        >
                                            <HelpOutlineTwoToneIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="stock_status">
                                        {t("Stock Status")}
                                    </InputLabel>
                                    <Select
                                        native
                                        label={t("Stock Status")}
                                        inputProps={{
                                            name: "stock_status",
                                        }}
                                    >
                                        <option aria-label="None" value="" />
                                        <option value={1}>
                                            {t("In stock")}
                                        </option>
                                        <option value={1}>
                                            {t("Out of stock")}
                                        </option>
                                        <option value={1}>
                                            {t("Back in stock soon")}
                                        </option>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <Box display="flex" alignItems="center">
                                    <TextField
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    Kg
                                                </InputAdornment>
                                            ),
                                        }}
                                        fullWidth
                                        name="weight"
                                        value={12}
                                        variant="outlined"
                                        label={t("Weight")}
                                        placeholder={t("Write weight ...")}
                                    />
                                    <Tooltip
                                        arrow
                                        placement="top"
                                        title={t(
                                            "Your have the weight units set to kilograms in your app settings",
                                        )}
                                    >
                                        <IconButton
                                            size="small"
                                            sx={{
                                                ml: 1,
                                            }}
                                            color="primary"
                                        >
                                            <HelpOutlineTwoToneIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                CM
                                            </InputAdornment>
                                        ),
                                    }}
                                    fullWidth
                                    name="length"
                                    variant="outlined"
                                    label={t("Length")}
                                    placeholder={t("Write length ...")}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                CM
                                            </InputAdornment>
                                        ),
                                    }}
                                    fullWidth
                                    name="width"
                                    variant="outlined"
                                    label={t("Width")}
                                    placeholder={t("Write width ...")}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="shipping_class">
                                        {t("Shipping class")}
                                    </InputLabel>
                                    <Select
                                        native
                                        label={t("Shipping class")}
                                        inputProps={{
                                            name: "shipping_class",
                                        }}
                                    >
                                        <option aria-label="None" value="" />
                                        <option value={1}>
                                            {t("No shipping class")}
                                        </option>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox />}
                                    label={t("Formatted Question")}
                                />
                                <Typography variant="h6" color="text.secondary">
                                    {t(
                                        "Enable this to only allow one of this item to be bought in a single order",
                                    )}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Card>
            </Grid>
            <Grid item xs={12}>
                {/* <GeneralSection /> */}
            </Grid>
        </>
    );
};

export default MainComponent;

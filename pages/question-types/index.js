import { useState, useEffect, useCallback } from "react";

import Head from "next/head";

import PageHeader from "src/content/Management/QuestionTypes/PageHeader";
import Footer from "src/components/Footer";
import PageTitleWrapper from "src/components/PageTitleWrapper";

import { Grid } from "@mui/material";
import { useRefMounted } from "src/hooks/useRefMounted";

import { productsApi } from "src/mocks/products";

import Results from "src/content/Management/QuestionTypes/Results";

function ManagementQueTypes() {
    return (
        <>
            <Head>
                <title>Question Types - Management</title>
            </Head>
            <PageTitleWrapper>
                <PageHeader />
            </PageTitleWrapper>

            <Grid
                sx={{ px: 4 }}
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                spacing={3}
            >
                <Grid item xs={12}>
                    <Results />
                </Grid>
            </Grid>
            <Footer />
        </>
    );
}

export default ManagementQueTypes;

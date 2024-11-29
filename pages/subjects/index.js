import { useState, useEffect, useCallback } from "react";

import Head from "next/head";

import PageHeader from "src/content/Management/Subjects/PageHeader";
import Footer from "src/components/Footer";
import PageTitleWrapper from "src/components/PageTitleWrapper";

import { Grid } from "@mui/material";
import { useRefMounted } from "src/hooks/useRefMounted";

import { productsApi } from "src/mocks/products";

import Results from "src/content/Management/Subjects/Results";

function ManagementSubjects() {
    return (
        <>
            <Head>
                <title>Subjects - Management</title>
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

export default ManagementSubjects;

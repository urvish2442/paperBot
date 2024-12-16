import { Grid } from "@mui/material";
import Head from "next/head";
import React from "react";
import Footer from "src/components/Footer";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import PageHeader from "src/content/Management/Questions/PageHeader";
import Results from "src/content/Management/Questions/Results";

const index = () => {
    return (
        <>
            <Head>
                <title>Question - Management</title>
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
};

export default index;

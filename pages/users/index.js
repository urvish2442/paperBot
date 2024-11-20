import { useState, useEffect, useCallback, useMemo } from "react";

import Head from "next/head";

import PageHeader from "src/content/Management/Users/PageHeader";
import Footer from "src/components/Footer";

import { Grid } from "@mui/material";
import { useRefMounted } from "src/hooks/useRefMounted";

import { usersApi } from "src/mocks/users";

import PageTitleWrapper from "src/components/PageTitleWrapper";

import Results from "src/content/Management/Users/Results";
import useMetaData from "src/hooks/useMetaData";
import { API_ROUTER } from "src/services/apiRouter";
import { useCreators } from "src/hooks/useFetchHooks";

function ManagementUsers() {
    const isMountedRef = useRefMounted();

    return (
        <>
            <Head>
                <title>Creator - Management</title>
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

export default ManagementUsers;

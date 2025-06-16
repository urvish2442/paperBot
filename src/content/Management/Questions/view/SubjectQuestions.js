import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import PageHeader from "../PageHeader";
import { Grid, Typography } from "@mui/material";
import Results from "./Results";

const SubjectQuestions = () => {
    const router = useRouter();
    const subjectName = router?.query?.name || "";
    return (
        <>
            <Head>
                <title>Questions - {subjectName}</title>
            </Head>
            <PageTitleWrapper>
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Grid item>
                        <Typography variant="h3" component="h3" gutterBottom>
                            Questions{" "}
                            <Typography component="span" variant="h5">
                                ({subjectName?.toUpperCase()})
                            </Typography>
                        </Typography>
                    </Grid>
                </Grid>
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
        </>
    );
};

export default SubjectQuestions;

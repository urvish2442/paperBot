import Head from "next/head";
import Router from "next/router";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import ThemeProvider from "src/theme/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "src/createEmotionCache";
import { appWithTranslation } from "next-i18next";
import { SidebarProvider } from "src/contexts/SidebarContext";
import { Provider as ReduxProvider } from "react-redux";
import { store, persistor } from "src/redux/store";
import Loader from "src/components/Loader";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import useScrollTop from "src/hooks/useScrollTop";
import { SnackbarProvider } from "notistack";
import { AuthConsumer, AuthProvider } from "src/contexts/JWTAuthContext";
import { Guest } from "src/components/Guest";
import BaseLayout from "src/layouts/BaseLayout";
import { Authenticated } from "src/components/Authenticated";
import AccentSidebarLayout from "src/layouts/AccentSidebarLayout";
import { PersistGate } from "redux-persist/integration/react";

const clientSideEmotionCache = createEmotionCache();

function TokyoApp(props) {
    const {
        Component,
        emotionCache = clientSideEmotionCache,
        pageProps,
    } = props;
    useScrollTop();

    const redirect = Component.redirect ?? true;

    Router.events.on("routeChangeStart", nProgress.start);
    Router.events.on("routeChangeError", nProgress.done);
    Router.events.on("routeChangeComplete", nProgress.done);

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <title>Paper Bot</title>
                {/* <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                /> */}
                 <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
            </Head>
            <ReduxProvider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <SidebarProvider>
                        <ThemeProvider>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <AuthProvider>
                                    <SnackbarProvider
                                        maxSnack={6}
                                        anchorOrigin={{
                                            vertical: "bottom",
                                            horizontal: "right",
                                        }}
                                    >
                                        <CssBaseline />
                                        <AuthConsumer>
                                            {(auth) =>
                                                !auth.isInitialized ? (
                                                    <Loader />
                                                ) : Component.guestLayout ? (
                                                    <Guest redirect={redirect}>
                                                        <BaseLayout>
                                                            <Component
                                                                {...pageProps}
                                                            />
                                                        </BaseLayout>
                                                    </Guest>
                                                ) : (
                                                    <Authenticated>
                                                        <AccentSidebarLayout>
                                                            <Component
                                                                {...pageProps}
                                                            />
                                                        </AccentSidebarLayout>
                                                    </Authenticated>
                                                )
                                            }
                                        </AuthConsumer>
                                    </SnackbarProvider>
                                </AuthProvider>
                            </LocalizationProvider>
                        </ThemeProvider>
                    </SidebarProvider>
                </PersistGate>
            </ReduxProvider>
        </CacheProvider>
    );
}

export default appWithTranslation(TokyoApp);

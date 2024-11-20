import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useAuth } from "src/hooks/useAuth";
import { PATH_AUTH } from "src/routes/paths";

export const Authenticated = (props) => {
    const { children } = props;
    const auth = useAuth();
    const router = useRouter();
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        if (!auth.isAuthenticated) {
            router.push({
                pathname: PATH_AUTH.login,
                query: { backTo: router.asPath },
            });
        } else {
            setVerified(true);
        }
    }, [router.isReady]);

    if (!verified) {
        return null;
    }

    return <>{children}</>;
};

Authenticated.propTypes = {
    children: PropTypes.node,
};

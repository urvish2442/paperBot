const calendarTranspile = require("next-transpile-modules")([
    "@fullcalendar/common",
    "@fullcalendar/react",
    "@fullcalendar/daygrid",
    "@fullcalendar/list",
    "@fullcalendar/timegrid",
]);

const withImages = require("next-images");

module.exports = withImages(
    calendarTranspile({
        // i18n: {
        //     defaultLocale: "en",
        //     locales: ["en"]
        // },
        async redirects() {
            return [
                {
                    source: "/",
                    destination: "/dashboard",
                    permanent: true,
                },
            ];
        },
        env: {
            HOST_API: process.env.HOST_API,
            ENVIRONMENT: process.env.ENVIRONMENT,
            SECRET_KEY: process.env.SECRET_KEY,
        },
    }),
);

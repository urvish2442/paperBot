import Head from "next/head";

import DashboardReportsContent from "src/content/DashboardPages/reports";

function DashboardReports() {
    return (
        <>
            <Head>
                <title>Reports Dashboard</title>
            </Head>
            <DashboardReportsContent />
        </>
    );
}

export default DashboardReports;

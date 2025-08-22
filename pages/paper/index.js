import Head from "next/head";

import Footer from "src/components/Footer";

import PaperMain from "src/content/Management/Paper/PaperMain";

function PaperPage() {
    return (
        <>
            <Head>
                <title>Question Paper</title>
            </Head>
            <PaperMain />
            <Footer />
        </>
    );
}

export default PaperPage;

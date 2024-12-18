import { useEffect, useState } from "react";

import { Divider, Pagination, Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "src/redux/store";
import { getMails } from "src/redux/slices/mailbox";
import ResultsActionBar from "./ResultsActionBar";
import { ResultsItem } from "./ResultsItem";
import { useTranslation } from "react-i18next";

export const MailboxResults = (props) => {
    const { tag } = props;

    const dispatch = useDispatch();
    const { mails } = useSelector((state) => state.mailbox);
    const [selectedMails, setSelectedMails] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(getMails({ tag }));
    }, [tag]);

    const handleSelectAllMails = () => {
        setSelectedMails(mails.allIds.map((mailId) => mailId));
    };

    const handleDeselectAllMails = () => {
        setSelectedMails([]);
    };

    const handleSelectOneMail = (mailId) => {
        setSelectedMails((prevSelectedMails) => {
            if (!prevSelectedMails.includes(mailId)) {
                return [...prevSelectedMails, mailId];
            }

            return prevSelectedMails;
        });
    };

    const handleDeselectOneMail = (mailId) => {
        setSelectedMails((prevSelectedMails) =>
            prevSelectedMails.filter((id) => id !== mailId),
        );
    };

    return (
        <Box>
            <ResultsActionBar
                onDeselectAll={handleDeselectAllMails}
                onSelectAll={handleSelectAllMails}
                selectedMails={selectedMails.length}
                mails={mails.allIds.length}
            />
            <Divider />

            {mails.allIds.length === 0 && (
                <Typography
                    sx={{
                        py: 5,
                    }}
                    variant="h3"
                    fontWeight="normal"
                    color="text.secondary"
                    align="center"
                >
                    {t("There are no messages in this category")}
                </Typography>
            )}

            {mails.allIds.map((mailId) => (
                <ResultsItem
                    mailbox={mails.byId[mailId]}
                    key={mailId}
                    href={
                        tag && tag !== "inbox"
                            ? `/applications/mailbox?mailId=${mailId}&tag=${tag}`
                            : `/applications/mailbox?mailId=${mailId}`
                    }
                    onDeselect={() => handleDeselectOneMail(mailId)}
                    onSelect={() => handleSelectOneMail(mailId)}
                    selected={selectedMails.includes(mailId)}
                />
            ))}
            {mails.allIds.length !== 0 && (
                <Box p={3} display="flex" justifyContent="center">
                    <Pagination
                        shape="rounded"
                        size="large"
                        count={3}
                        variant="outlined"
                        color="primary"
                    />
                </Box>
            )}
        </Box>
    );
};

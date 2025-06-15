import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import Paragraph from "@editorjs/paragraph";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import { Divider, useTheme } from "@mui/material";
import { Button, Box } from "@mui/material";
import TableChartTwoToneIcon from "@mui/icons-material/TableChartTwoTone";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ImageIcon from "@mui/icons-material/Image";
import FormatStrikethroughIcon from "@mui/icons-material/FormatStrikethrough";
import Warning from "@editorjs/warning";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Raw from "@editorjs/raw";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import SimpleImage from "@editorjs/simple-image";
// import EmbedIcon from "@mui/icons-material/Embed";
// import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
// import CodeIcon from "@mui/icons-material/Code";
// import LinkIcon from "@mui/icons-material/Link";
// import RawIcon from "@mui/icons-material/Description";
// import HeaderIcon from "@mui/icons-material/Title";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export const EDITOR_JS_TOOLS = {
    paragraph: {
        class: Paragraph,
        inlineToolbar: ["bold", "italic"],
    },
    header: Header,
    list: {
        class: List,
        // inlineToolbar: ["bold", "italic"],
    },
    table: Table,
    quote: Quote,
    // delimiter: Delimiter,
    embed: Embed,
    image: {
        class: Image,
        config: {
            uploader: {
                uploadByFile(file, block) {
                    return new Promise((resolve, reject) => {
                        if (!file) {
                            // If no file is selected, remove the image block and reject the promise
                            block?.api?.blocks?.remove(block.id); // Remove the image block from the editor
                            reject("No file selected");
                            return;
                        }

                        // Create a local URL for the uploaded image file
                        const objectUrl =
                            URL.createObjectURL(file) ||
                            "https://cdn.britannica.com/60/182360-050-CD8878D6/Avengers-Age-of-Ultron-Joss-Whedon.jpg";

                        // Return the object URL as the image source
                        resolve({
                            success: 1,
                            file: {
                                url: objectUrl,
                            },
                        });
                    });
                },
                withCaption: false,
            },
        },
    },
    marker: Marker,
    checklist: CheckList,
    inlineCode: InlineCode,
    // raw: Raw,
    // warning: Warning,
    // code: Code,
    // linkTool: LinkTool,
    // simpleImage: SimpleImage,
};

const TOOLS = [
    { tool: "table", label: "Table", icon: <TableChartTwoToneIcon /> },
    { tool: "list", label: "List", icon: <ListAltIcon /> },
    // { tool: "image", label: "Image", icon: <ImageIcon /> },
    // {
    //     tool: "delimiter",
    //     label: "Delimiter",
    //     icon: <FormatStrikethroughIcon />,
    // },
];

const Editor = ({
    onSave,
    reset,
    setReset,
    holder = "question",
    values = {},
}) => {
    const editorInstance = useRef(null);
    const theme = useTheme();
    const insertToolBlock = async (tool, config = {}) => {
        if (editorInstance.current) {
            await editorInstance.current.blocks.insert(tool, config);
        }
    };

    useEffect(() => {
        if (!reset) return;
        setReset(false);
        if (editorInstance.current) {
            editorInstance.current?.clear();
        }
        // return () => {
        //     if (editorInstance.current) {
        //         editorInstance.current = null;
        //     }
        // };
    }, [reset]);

    useEffect(() => {
        if (!editorInstance.current) {
            editorInstance.current = new EditorJS({
                holder: holder,
                tools: EDITOR_JS_TOOLS,
                placeholder: `Enter ${holder} here...`,
                autofocus: true,
                data: values,
                onReady: () => {
                    const editorRedactor = document.querySelector(
                        `#${holder} .codex-editor .codex-editor__redactor`,
                    );
                    if (editorRedactor) {
                        editorRedactor.style.paddingBottom = "30px";
                    }

                    // to hide checklist tool of editorjs/list
                    setTimeout(() => {
                        const listItems = document.querySelectorAll(
                            ".ce-popover-item[data-item-name='list']",
                        );
                        if (listItems.length > 2) {
                            listItems[2].style.display = "none";
                        }
                    }, 100);
                },
                onChange: async () => {
                    const savedData = await editorInstance?.current?.save();
                    onSave(savedData);
                },
            });
        }

        return () => {
            if (editorInstance.current) {
                // editorInstance.current?.destroy();
                editorInstance.current = null;
            }
        };
    }, []);

    return (
        <>
            <div
                style={{
                    border: "1px solid #ddd",
                    padding: theme.general.padding,
                    borderRadius: theme.general.borderRadius,
                }}
            >
                <Box sx={{ display: "flex", gap: 1, margin: 1 }}>
                    {TOOLS.map((tool) => (
                        <Button
                            key={tool.tool}
                            // variant="contained"
                            // color="primary"
                            onClick={() => insertToolBlock(tool.tool)}
                            startIcon={tool.icon || ""}
                        >
                            {tool.label}
                        </Button>
                    ))}
                </Box>
                <Divider />
                <div id={holder}></div>
            </div>
        </>
    );
};

export default Editor;

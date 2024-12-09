import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import Paragraph from "@editorjs/paragraph";
import List from "@editorjs/list";
import Warning from "@editorjs/warning";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Image from "@editorjs/image";
import Raw from "@editorjs/raw";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import SimpleImage from "@editorjs/simple-image";
import { useTheme } from "@mui/material";

export const EDITOR_JS_TOOLS = {
    embed: Embed,
    table: Table,
    paragraph: Paragraph,
    list: List,
    warning: Warning,
    code: Code,
    linkTool: LinkTool,
    image: {
        class: Image,
        config: {
            uploader: {
                uploadByFile(file, block) {
                    return new Promise((resolve, reject) => {
                        if (!file) {
                            // If no file is selected, remove the image block and reject the promise
                            block.api.blocks.remove(block.id); // Remove the image block from the editor
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

    raw: Raw,
    header: Header,
    quote: Quote,
    marker: Marker,
    checklist: CheckList,
    delimiter: Delimiter,
    inlineCode: InlineCode,
    simpleImage: SimpleImage,
};

const Editor = ({ onSave }) => {
    const editorInstance = useRef(null);

    useEffect(() => {
        if (!editorInstance.current) {
            editorInstance.current = new EditorJS({
                holder: "editorjs",
                tools: EDITOR_JS_TOOLS,
                placeholder: "Type your content here...",
                autofocus: true,
                onChange: async () => {
                    const savedData = await editorInstance?.current?.save();
                    onSave(savedData);
                },
            });
        }

        return () => {
            if (editorInstance.current) {
                editorInstance.current.destroy();
                editorInstance.current = null;
            }
        };
    }, []);

    const theme = useTheme(); // Get theme context

    return (
        <div
            id="editorjs"
            style={{
                border: "1px solid #ddd",
                padding: theme.general.padding,
                borderRadius: theme.general.borderRadius,
            }}
        ></div>
    );
};

export default Editor;

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { Box, styled } from "@mui/material";
import { useRefMounted } from "src/hooks/useRefMounted";
import AbcTwoToneIcon from "@mui/icons-material/AbcTwoTone";
import ReactDOM from "react-dom";


const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const fullToolbarOptions = [
    // [{ font: [] }], // Font styles
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote", "code-block"],
    [
        // { list: "ordered" },
        { list: "decimal" },
        { list: "upper-alpha" },
        { list: "lower-alpha" },
        { list: "upper-roman" },
        { list: "lower-roman" },
    ],
    // [{ indent: "-1" }, { indent: "+1" }],
    // [{ direction: "rtl" }], // Text direction
    [{ align: [] }], // Alignment options
    // ["link", "image", "video"], // Links, images, and videos
    ["clean"], // Clear formatting
];

const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "color",
    "background",
    "script",
    "align",
];

const modules = {
    toolbar: fullToolbarOptions,
};
const EditorWrapper = styled(Box)(
    ({ theme }) => `

    .ql-editor {
      min-height: 100px;
    }

    .ql-snow .ql-picker {
      color: ${theme.colors.alpha.black[100]};
    }

    .ql-snow .ql-stroke {
      stroke: ${theme.colors.alpha.black[100]};
    }

    .ql-toolbar.ql-snow {
      border-top-left-radius: ${theme.general.borderRadius};
      border-top-right-radius: ${theme.general.borderRadius};
    }

    .ql-toolbar.ql-snow,
    .ql-container.ql-snow {
      border-color: ${theme.colors.alpha.black[30]};
    }

    .ql-container.ql-snow {
      border-bottom-left-radius: ${theme.general.borderRadius};
      border-bottom-right-radius: ${theme.general.borderRadius};
    }

    .ql-header .ql-picker-options{
      overflow : auto;
    }

    .ql-editor ol[data-list="upper-alpha"] > li {
        list-style-type: upper-alpha;
    }

    .ql-editor ol[data-list="lower-alpha"] > li {
        list-style-type: lower-alpha;
    }

    .ql-editor ol[data-list="upper-roman"] > li{
        list-style-type: upper-roman;
    }

    .ql-editor ol[data-list="lower-roman"] > li {
        list-style-type: lower-roman;
    }

    .ql-editor ol[data-list="decimal"] > li {
        list-style-type: decimal;
    }

    .ql-editor ol li {
        padding-left: 0px !important;
        counter-reset: none !important;
        counter-increment: none !important;
    }

    .ql-editor ol li:before {
    content: none !important;
}

    &:hover {
      .ql-toolbar.ql-snow,
      .ql-container.ql-snow {
        border-color: ${theme.colors.alpha.black[50]};
      }
    }
`,
);

const QuillEditor = ({ editorContent, handleEditorChange }) => {
    const isMountedRef = useRefMounted();

    useEffect(() => {
        const Quill = require("quill");
        const ListItem = Quill.import("formats/list/item");
        const ListFormat = Quill.import("formats/list");

        const CUSTOM_LIST_TYPES = [
            "upper-alpha",
            "lower-alpha",
            "upper-roman",
            "lower-roman",
            "decimal",
        ];

        const getType = {
            decimal: "1",
            "upper-alpha": "A",
            "lower-alpha": "a",
            "upper-roman": "I",
            "lower-roman": "i",
        };

        class CustomListItem extends ListItem {
            static formats(domNode) {
                return domNode.getAttribute("data-list") || null;
            }

            static create(value) {
                const node = super.create();
                if (CUSTOM_LIST_TYPES.includes(value)) {
                    node.setAttribute("data-list", value);
                    node.setAttribute("type", getType[value]);
                }
                return node;
            }
        }
        CustomListItem.blotName = "list-item";
        Quill.register(CustomListItem, true);

        class CustomOrderedList extends ListFormat {
            static formats(domNode) {
                return (
                    domNode.getAttribute("data-list") || super.formats(domNode)
                );
            }

            static create(value) {
                const node = super.create(value);
                if (CUSTOM_LIST_TYPES.includes(value)) {
                    node.setAttribute("data-list", value);
                    node.setAttribute("type", getType[value]);
                }
                return node;
            }
        }
        CustomOrderedList.blotName = "list";
        CustomOrderedList.tagName = "OL";
        Quill.register(CustomOrderedList, true);

        // // Custom Unordered List
        // class CustomUnorderedList extends ListFormat {
        //     static formats(domNode) {
        //         return null; // Unordered lists don't have custom formats
        //     }

        //     static create() {
        //         const node = document.createElement("UL"); // Create a UL element
        //         return node;
        //     }
        // }
        // CustomUnorderedList.blotName = "unordered-list";
        // CustomUnorderedList.tagName = "UL"; // Ensures it's an unordered list
        // Quill.register(CustomUnorderedList, true);
    }, []);

    const updateButtons = () => {
        const buttons = document.querySelectorAll(".ql-list");
        buttons.forEach((button) => {
            switch (button.getAttribute("value")) {
                case "upper-alpha":
                    const iconContainer = document.createElement("span");
                    ReactDOM.render(<AbcTwoToneIcon />, iconContainer);
                    button.appendChild(iconContainer);
                    break;
                case "lower-alpha":
                    button.innerHTML = "abc";
                    break;
                case "upper-roman":
                    button.innerHTML = "I.II.";
                    break;
                case "lower-roman":
                    button.innerHTML = "i.ii.";
                    break;
                case "decimal":
                    button.innerHTML = "123";
                    break;
                default:
                    break;
            }
        });
    };

    useEffect(() => {
        let timer;
        timer = setTimeout(() => {
            updateButtons();
        }, 1000);
        return () => clearTimeout(timer);
    }, [isMountedRef()]);
    return (
        <>
            <EditorWrapper>
                <ReactQuill
                    modules={modules}
                    formats={formats}
                    value={editorContent}
                    onChange={handleEditorChange}
                    // readOnly
                />
            </EditorWrapper>
        </>
    );
};

export default QuillEditor;

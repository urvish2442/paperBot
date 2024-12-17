import { useTheme } from "@mui/material";
import React from "react";

const QuestionFormatter = ({ data, type = "Question" }) => {
    const theme = useTheme(); // Get theme context

    // Return "No content to display" if no data or blocks are available
    if (!data || !data.blocks) return <p>No {type} Available!</p>;

    return (
        <>
            {data?.blocks.map((block, index) => {
                switch (block.type) {
                    case "header":
                        return React.createElement(
                            `h${block.data.level}`,
                            { key: index },
                            block.data.text,
                        );

                    case "paragraph":
                        return (
                            <p
                                key={index}
                                dangerouslySetInnerHTML={{
                                    __html: block.data.text,
                                }}
                            ></p>
                        );

                    case "list":
                        const renderListItems = (items, style, counterType) =>
                            items.map((item, i) => (
                                <li key={i}>
                                    {item.content}
                                    {item.items && item.items.length > 0 && (
                                        <ListTag
                                            style={
                                                counterType
                                                    ? {
                                                          listStyleType:
                                                              counterType,
                                                      }
                                                    : {}
                                            }
                                        >
                                            {renderListItems(
                                                item.items,
                                                style,
                                                counterType,
                                            )}
                                        </ListTag>
                                    )}
                                </li>
                            ));

                        const ListTag =
                            block.data.style === "ordered" ? "ol" : "ul";

                        const counterType =
                            block.data.style === "ordered"
                                ? block.data.meta?.counterType || "decimal"
                                : null;

                        const start =
                            block.data.style === "ordered"
                                ? block.data.meta?.start || 1
                                : null;

                        return (
                            <ListTag
                                key={index}
                                style={
                                    counterType
                                        ? { listStyleType: counterType }
                                        : {}
                                }
                                {...(start && { start })} // Add start attribute if applicable
                            >
                                {renderListItems(
                                    block.data.items,
                                    block.data.style,
                                    counterType,
                                )}
                            </ListTag>
                        );

                    case "quote":
                        return (
                            <blockquote
                                key={index}
                                style={{
                                    borderLeft: "4px solid #ccc",
                                    paddingLeft: "10px",
                                }}
                            >
                                <p>{block.data.text}</p>
                                <cite>{block.data.caption}</cite>
                            </blockquote>
                        );

                    case "table":
                        return (
                            <table
                                key={index}
                                style={{
                                    borderCollapse: "collapse",
                                    width: "100%",
                                    textAlign: "left",
                                }}
                            >
                                {block.data.withHeadings && (
                                    <thead>
                                        <tr>
                                            {block.data.content[0]?.map(
                                                (header, headerIndex) => (
                                                    <th
                                                        key={headerIndex}
                                                        style={{
                                                            border: "1px solid #ddd",
                                                            padding: "8px",
                                                            fontWeight: "bold", // Make the header bold
                                                        }}
                                                    >
                                                        {header}
                                                    </th>
                                                ),
                                            )}
                                        </tr>
                                    </thead>
                                )}
                                {/* <tbody> */}
                                {/* Render table heading if withHeadings is true */}

                                {/* Render the table rows */}
                                <tbody>
                                    {block.data.content
                                        .slice(block.data.withHeadings ? 1 : 0)
                                        .map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                {row.map((cell, cellIndex) => (
                                                    <td
                                                        key={cellIndex}
                                                        style={{
                                                            border: "1px solid #ddd", // Merged border style
                                                            padding: "8px",
                                                        }}
                                                    >
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                </tbody>
                                {/* </tbody> */}
                            </table>
                        );

                    case "delimiter":
                        return <hr key={index} />;

                    case "code":
                        return (
                            <pre
                                key={index}
                                style={{
                                    background: "#f4f4f4",
                                    padding: "10px",
                                }}
                            >
                                <code>{block.data.code}</code>
                            </pre>
                        );

                    case "image":
                        return (
                            <figure key={index}>
                                <img
                                    src={block.data.file.url}
                                    alt={block.data.caption}
                                    style={{ maxWidth: "100%" }}
                                />
                                {block.data.caption && (
                                    <figcaption>
                                        {block.data.caption}
                                    </figcaption>
                                )}
                            </figure>
                        );

                    case "linkTool":
                        return (
                            <a
                                key={index}
                                href={block.data.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {block.data.link}
                            </a>
                        );

                    case "embed":
                        return (
                            <div key={index}>
                                <iframe
                                    src={block.data.embed}
                                    width={block.data.width}
                                    height={block.data.height}
                                    frameBorder="0"
                                    allowFullScreen
                                ></iframe>
                                {block.data.caption && (
                                    <p>{block.data.caption}</p>
                                )}
                            </div>
                        );

                    case "raw":
                        return (
                            <div
                                key={index}
                                dangerouslySetInnerHTML={{
                                    __html: block.data.html,
                                }}
                            />
                        );

                    case "marker":
                        return (
                            <span key={index} style={{ background: "yellow" }}>
                                {block.data.text}
                            </span>
                        );

                    case "checklist":
                        return (
                            <ul key={index}>
                                {block.data.items.map((item, i) => (
                                    <p
                                        key={i}
                                        style={{
                                            textDecoration: item.checked
                                                ? "line-through"
                                                : "none",
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={item.checked}
                                            readOnly
                                        />
                                        {item.text}
                                    </p>
                                ))}
                            </ul>
                        );

                    case "inlineCode":
                        return <code key={index}>{block.data.code}</code>;

                    default:
                        return null;
                }
            })}
        </>
    );
};

export default QuestionFormatter;

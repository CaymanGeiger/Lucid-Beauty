// CustomHeader.js or CustomHeader.tsx
"use client"
import React from 'react';

const CustomHeader = () => {
    return (
        <div style={{
            borderBottom: "1px solid #f0a4fa",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            borderRadius: "",
            position: "relative",
            whiteSpace: "nowrap",
            paddingTop: "28px",
            }}>
            <h4 style={{
                width: "fit-content",
                height: "100%",
                color: "black",
                marginBottom: "10px",
                borderBottom: "1px solid black",
                whiteSpace: "nowrap",
            }}>
                Lucid Beauty Chatbot
            </h4>
        </div>
    );
};

export default CustomHeader;

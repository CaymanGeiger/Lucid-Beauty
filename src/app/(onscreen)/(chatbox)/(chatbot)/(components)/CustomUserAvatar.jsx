
"use client"
import React from 'react';
import "./customuseravatar.css"

const CustomUserAvatar = () => {
    return (
        <div
        className='react-chatbot-kit-user-message-name '
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginBottom: '0'
        }}>
            <h4 style={{
                margin: 0,
                color: 'black',
                fontSize: "16px",
                fontWeight: '500'
            }}>
                &#128587; Me:
            </h4>
        </div>
    );
};

export default CustomUserAvatar;

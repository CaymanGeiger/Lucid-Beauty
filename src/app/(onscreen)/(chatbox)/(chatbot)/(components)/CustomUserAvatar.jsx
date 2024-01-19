
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
            <h4 className='avatarMeTitle'>
                &#128587; Me:
            </h4>
        </div>
    );
};

export default CustomUserAvatar;

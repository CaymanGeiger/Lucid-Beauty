"use client"
import { Chatbot } from 'react-chatbot-kit';
import MessageParser from './(chatbot)/MessageParser';
import ActionProvider from './(chatbot)/ActionProvider';
import config from './(chatbot)/config';
import "./radixscroll.css";
import * as ScrollArea from '@radix-ui/react-scroll-area';
import "./chatbox1.css"

const ChatBox = () => {

    return (
        <div className="chatBoxDiv">
            <ScrollArea.Root className="ScrollAreaRoot">
                <ScrollArea.Viewport className="ScrollAreaViewport">
                    <Chatbot
                        config={config}
                        messageParser={MessageParser}
                        actionProvider={ActionProvider}
                    />
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
                    <ScrollArea.Thumb className="ScrollAreaThumb" />
                </ScrollArea.Scrollbar>
                <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="horizontal">
                    <ScrollArea.Thumb className="ScrollAreaThumb" />
                </ScrollArea.Scrollbar>
                <ScrollArea.Corner className="ScrollAreaCorner" />
            </ScrollArea.Root>
        </div>
    );
};

export default ChatBox;

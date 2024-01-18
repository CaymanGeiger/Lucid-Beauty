// config.ts
"use client"
import { createChatBotMessage } from 'react-chatbot-kit';
import CustomBotAvatar from './CustomBotAvatar'; // Adjust the path as necessary
import CustomHeader from './(components)/CustomHeader';
import CustomUserAvatar from './(components)/CustomUserAvatar';

const botName = 'bot';

const config = {
  initialMessages: [
    createChatBotMessage("\uD83D\uDC4B Hello! I'm the Lucid Beauty Messaging Bot!"),
    createChatBotMessage("Ask me a question and I will get it sent to our team!",
      {
        delay: 3000,
      }
    ),
],
  customComponents: {
    header: CustomHeader,
    botAvatar: CustomBotAvatar,
    userAvatar: CustomUserAvatar,

  },
  customStyles: {
    botMessageBox: {
      backgroundColor: "#eccff076",
    },
    chatButton: {

    },
  },
  state: {
    gist: '',
    infoBox: '',
    userMessage: '',
    userEmail: '',
  },

};

export default config;

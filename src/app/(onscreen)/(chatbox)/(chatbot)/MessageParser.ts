"use client"

type ActionProviderType = {
  handleInitialMessage: () => void;
  handleUserQuestion: (userQuestion: string) => void;
  handleUserEmail: (userEmail: string) => void;
};

class MessageParser {
  actionProvider: ActionProviderType;
  conversationStage: string;
  messageCount: number;

  constructor(actionProvider: ActionProviderType) {
    this.actionProvider = actionProvider;
    this.conversationStage = "initial";
    this.messageCount = 0;
  }

  parse(message: string) {
    const lowerCaseMessage = message.toLowerCase();
    this.messageCount += 1;

    if (this.conversationStage === "initial" && this.messageCount <= 1) {
      this.actionProvider.handleInitialMessage();
      this.conversationStage = "questionReceived";
    } else if (this.conversationStage === "questionReceived") {
      if (this.isQuestion(lowerCaseMessage)) {
        this.conversationStage = "emailReceived";
        this.actionProvider.handleUserQuestion(lowerCaseMessage);
      }
    } else if (this.conversationStage === "emailReceived" && this.messageCount >= 3) {
      if (this.isEmail(lowerCaseMessage)) {
        this.actionProvider.handleUserEmail(lowerCaseMessage);
      }
    }
  }

  isQuestion(message: string): boolean {
    // Implement logic to check if the message is a question
    return true; // Placeholder logic
  }

  isEmail(message: string): boolean {
    // Implement logic to validate email
    return true; // Placeholder logic
  }
}

export default MessageParser;

// ActionProvider.ts
"use client"
type CreateChatBotMessageType = (message: string, options?: any) => any;
type SetStateType = (state: any) => void;

class ActionProvider {
    createChatBotMessage: CreateChatBotMessageType;
    setState: SetStateType;
    isUserLoggedIn: boolean;

    constructor(
        createChatBotMessage: CreateChatBotMessageType,
        setStateFunc: SetStateType,
        isUserLoggedIn: boolean
    ) {
        this.createChatBotMessage = createChatBotMessage;
        this.setState = setStateFunc;
        this.isUserLoggedIn = isUserLoggedIn;
    }

    handleInitialMessage() {
        const message = this.createChatBotMessage("Please provide your email so we can get back to you! You will receive an email confirming this ticket.");
        this.setState((prevState: any) => ({
            ...prevState,
            messages: [...prevState.messages, message]
        }));
    }

    handleUserQuestion(userQuestion: string) {
        const response = this.createChatBotMessage("Thank you for your question. Please provide your email so we can get back to you.");
        this.setState((prevState: any) => ({
            ...prevState,
            userQuestion: userQuestion,
            messages: [...prevState.messages, response]
        }));
    }

    handleUserEmail(userEmail: string) {
        const thankYouMessage = this.createChatBotMessage("Thank you! We have received your email and will respond shortly.");
        this.setState((prevState: any) => ({
            ...prevState,
            userEmail: userEmail,
            messages: [...prevState.messages, thankYouMessage]
        }));
    }
}

export default ActionProvider;

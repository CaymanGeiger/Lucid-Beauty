// ActionProvider.ts
"use client"
type CreateChatBotMessageType = (message: string, options?: any) => any;
type SetStateType = (state: any) => void;

class ActionProvider {
    createChatBotMessage: CreateChatBotMessageType;
    setState: SetStateType;
    isUserLoggedIn: boolean; // Add a property to track login status

    constructor(
        createChatBotMessage: CreateChatBotMessageType,
        setStateFunc: SetStateType,
        isUserLoggedIn: boolean // Pass the login status when creating the instance
    ) {
        this.createChatBotMessage = createChatBotMessage;
        this.setState = setStateFunc;
        this.isUserLoggedIn = isUserLoggedIn;
    }

    handleInitialMessage() {
        // This method will now be triggered on the user's first message after the bot's greeting
        
        const message = this.createChatBotMessage("Please provide your email so we can get back to you! You will receive an email confirming this ticket.");
        this.setState((prevState: any) => ({
            ...prevState,
            messages: [...prevState.messages, message]
        }));
    }

    handleUserQuestion(userQuestion: string) {
        // Respond to the user's question
        const response = this.createChatBotMessage("Thank you for your question. Please provide your email so we can get back to you.");
        this.setState((prevState: any) => ({
            ...prevState,
            userQuestion: userQuestion,
            messages: [...prevState.messages, response]
        }));
    }

    handleUserEmail(userEmail: string) {
        // Acknowledge the email and conclude the interaction
        const thankYouMessage = this.createChatBotMessage("Thank you! We have received your email and will respond shortly.");
        this.setState((prevState: any) => ({
            ...prevState,
            userEmail: userEmail,
            messages: [...prevState.messages, thankYouMessage]
        }));
    }

    // Add more action handlers as needed
}

export default ActionProvider;

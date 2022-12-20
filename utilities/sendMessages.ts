import MessagingResponse from "twilio/lib/twiml/MessagingResponse";

export default (whatsappResponse: MessagingResponse) =>
  (messages: string[]) => {
    messages.forEach((message) => {
      whatsappResponse.message(message);
    });
  };

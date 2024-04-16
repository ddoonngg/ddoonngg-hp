import { VStack } from "@chakra-ui/react";
import MessageItem from "./MessageItem";
import WelcomePanel from "./WelcomePanel";
import { useChatContext } from "../../contexts/ChatProvider";

export default function ChatMessageList() {
  const { messages } = useChatContext();
  return (
    <VStack w="100%" textAlign={"left"} alignItems={"flex-start"}>
      {messages.length === 0 ? (
        <WelcomePanel />
      ) : (
        messages.map((message, index) => (
          <MessageItem key={index} message={message} />
        ))
      )}
    </VStack>
  );
}

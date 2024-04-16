import { useChatContext } from "../../contexts/ChatProvider";
import ChatInput from "./ChatInput";
import ChatMessageList from "./ChatMessageList";
import { Box, VStack } from "@chakra-ui/react";

export default function ChatWindow() {
  const { onSubmit } = useChatContext();

  return (
    <Box as="main">
      <VStack
        borderRadius="md"
        height={"100vh"}
        justifyContent="space-between"
        p={8}
      >
        <Box borderRadius={12} w="100%">
          <ChatMessageList />
        </Box>
        <ChatInput onSubmit={onSubmit} />
      </VStack>
    </Box>
  );
}

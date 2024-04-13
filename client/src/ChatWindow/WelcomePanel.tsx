import { Box, VStack, Text, Heading, Button } from "@chakra-ui/react";
import { RiRobot2Line } from "react-icons/ri";
import { useChatContext } from "../contexts/ChatProvider";

export default function WelcomePanel() {
  return (
    <VStack justify={"space-evenly"} w="100%">
      <Box mt={"5%"}>
        <RiRobot2Line size={"2.5rem"} />
      </Box>
      <Heading color={"green.500"}>AI PROFILE BOT</Heading>
      <Text fontSize="medium">Please ask anything about me</Text>
      <VStack mt={8}>
        <HintButton text="Introduce yourself?" />
        <HintButton text="Tell me about your background?" />
        <HintButton text="What are your skills?" />
        <HintButton text="Share your experience?" />
      </VStack>
    </VStack>
  );
}

function HintButton({ text }: { text: string }) {
  const { onSubmit } = useChatContext();
  return (
    <Button
      variant={"outline"}
      size={"md"}
      p={8}
      m={4}
      borderRadius={"xl"}
      colorScheme="gray"
    >
      <Text
        onClick={() => {
          onSubmit({ data: text, from: "User" });
        }}
      >
        {text}
      </Text>
    </Button>
  );
}

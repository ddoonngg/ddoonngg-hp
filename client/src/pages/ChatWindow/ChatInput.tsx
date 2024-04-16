import { Button, HStack, Textarea } from "@chakra-ui/react";
import { FaArrowCircleUp } from "react-icons/fa";
import { useState } from "react";
import { Message } from "../../models/message";
import { END_SYMBOL } from "../../constants";

export default function ChatInput({
  onSubmit,
}: {
  onSubmit: (userInput: Message) => void;
}) {
  const [userInput, setUserInput] = useState("");

  const handleEnterKeyPress = () => {
    onSubmit({ data: userInput, from: "User" });
    setUserInput("");
  };

  const handleKeyPress = (event: { key: string }) => {
    if (event.key === "Enter") {
      handleEnterKeyPress();
    }
  };

  const isButtonDisabled = userInput === "";

  return (
    <HStack position={"relative"} w={"100%"}>
      <Textarea
        autoFocus={true}
        borderRadius={"xl"}
        resize={"none"}
        size={"lg"}
        value={userInput}
        onKeyUp={handleKeyPress}
        placeholder="Ask anything about me!"
        onChange={(e) => {
          setUserInput((e.target as HTMLTextAreaElement).value);
        }}
      />

      <Button
        position={"absolute"}
        right={"6px"}
        bottom={"12px"}
        height={"1rem"}
        p={0}
        backgroundColor={"transparent"}
        onClick={() => {
          onSubmit({ data: `${userInput}${END_SYMBOL}`, from: "User" });
          setUserInput("");
        }}
      >
        <FaArrowCircleUp
          cursor={"pointer"}
          opacity={isButtonDisabled ? "0.3" : "1"}
          size={"1.8rem"}
        />
      </Button>
    </HStack>
  );
}

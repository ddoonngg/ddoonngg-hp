import { useEffect } from "react";
import ChatWindow from "./ChatWindow/ChatWindow";
import { ChakraProvider } from "@chakra-ui/react";
import axios from "axios";
import { ChatProvider } from "./contexts/ChatProvider";
import { DomainProvider } from "./contexts/DomainProvider";

function App() {
  useEffect(() => {
    axios.get("/health").then((res) => {
      console.log(res.data);
    });
  }, []);
  // 2. Wrap ChakraProvider at the root of your app
  return (
    <ChakraProvider>
      <DomainProvider>
        <ChatProvider>
          <ChatWindow />
        </ChatProvider>
      </DomainProvider>
    </ChakraProvider>
  );
}

export default App;

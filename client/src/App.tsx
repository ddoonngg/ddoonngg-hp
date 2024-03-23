import { useEffect } from "react";
// import ChatWindow from "./ChatWindow/ChatWindow";
import { ChakraProvider } from "@chakra-ui/react";
import axios from "axios";

// 1. import `ChakraProvider` component

function App() {
  useEffect(() => {
    axios.get("/health").then((res) => {
      console.log(res.data);
    });
  }, []);
  // 2. Wrap ChakraProvider at the root of your app
  return (
    <ChakraProvider>
      {/* <ChatWindow /> */}
      <h1>hello</h1>
    </ChakraProvider>
  );
}

export default App;

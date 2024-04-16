import { ChakraProvider } from "@chakra-ui/react";

import { ChatProvider } from "./contexts/ChatProvider";
import { DomainProvider } from "./contexts/DomainProvider";
import { Welcome } from "./pages/welcome";

function App() {
  return (
    <ChakraProvider>
      <DomainProvider>
        <ChatProvider>
          <Welcome />
        </ChatProvider>
      </DomainProvider>
    </ChakraProvider>
  );
}

export default App;

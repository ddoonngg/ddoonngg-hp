import ChatWindow from './ChatWindow/ChatWindow';
import { ChakraProvider } from '@chakra-ui/react';

// 1. import `ChakraProvider` component

function App() {
  // 2. Wrap ChakraProvider at the root of your app
  return (
    <ChakraProvider>
      <ChatWindow />
    </ChakraProvider>
  );
}

export default App;

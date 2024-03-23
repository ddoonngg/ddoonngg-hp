import { useCallback, useState, useRef, useEffect } from 'react';
import ChatInput from './ChatInput';
import ChatMessageList from './ChatMessageList';
import { Box, VStack } from '@chakra-ui/react';
import { Message } from '../models/message';
import { END_SYMBOL, wsUrl } from '../constants';

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const connectWebSocket = useCallback(() => {
    // Create a new WebSocket connection
    console.log('connectWebSocket()');
    wsRef.current = new WebSocket(wsUrl);

    // Set up event listeners for the WebSocket connection
    const { current: ws } = wsRef;
    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      const { data } = event;

      if (data === END_SYMBOL) {
        console.log('end of assistant message');
        return;
      }

      // appending chars to last message

      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];

        if (lastMessage && lastMessage.from === 'Assistant') {
          return [...prevMessages.slice(0, prevMessages.length - 1), { ...lastMessage, data: lastMessage.data + data }];
        } else {
          // rely message from assistant, create a new one
          return [...prevMessages, { data, from: 'Assistant' }];
        }
      });
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      console.log('cleaned up');
      if (wsRef.current) {
        console.log('closing ws');
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    return connectWebSocket();
  }, [connectWebSocket]);

  const onSubmit = useCallback((inputMessage: Message) => {
    // append user input
    setMessages((prevMessages) => [...prevMessages, inputMessage]);
    wsRef.current?.send(inputMessage.data);
  }, []);

  return (
    <Box as='main'>
      <VStack borderRadius='md' height={'100vh'} justifyContent='space-between' p={8}>
        <Box borderRadius={12} w='100%'>
          <ChatMessageList messages={messages} />
        </Box>
        <ChatInput onSubmit={onSubmit} />
      </VStack>
    </Box>
  );
}

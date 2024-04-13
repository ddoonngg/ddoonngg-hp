import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { END_SYMBOL } from "../constants";
import { Message } from "../models/message";

const ChatContext = createContext<{
  messages: Message[];
  onSubmit: (inputMessage: Message) => void;
}>({ messages: [], onSubmit: () => {} });

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const connectWebSocket = useCallback(() => {
    // Create a new WebSocket connection
    console.log("connectWebSocket() invoked");
    const wsUrl = `wss://${location.hostname}:${
      import.meta.env.CLIENT_PORT || 3000
    }/ws`;

    wsRef.current = new WebSocket(wsUrl);

    // Set up event listeners for the WebSocket connection
    const { current: ws } = wsRef;
    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (event) => {
      const { data } = event;

      if (data === END_SYMBOL) {
        console.log("end of assistant message");
        return;
      }

      // appending chars to last message

      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];

        if (lastMessage && lastMessage.from === "Assistant") {
          return [
            ...prevMessages.slice(0, prevMessages.length - 1),
            { ...lastMessage, data: lastMessage.data + data },
          ];
        } else {
          // rely message from assistant, create a new one
          return [...prevMessages, { data, from: "Assistant" }];
        }
      });
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      console.log("cleaned up");
      if (wsRef.current) {
        console.log("closing ws");
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  const onSubmit = useCallback((inputMessage: Message) => {
    // append user input
    setMessages((prevMessages) => [...prevMessages, inputMessage]);
    wsRef.current?.send(inputMessage.data);
  }, []);

  useEffect(() => {
    return connectWebSocket();
  }, []);

  return (
    <ChatContext.Provider value={{ messages, onSubmit }}>
      {children}
    </ChatContext.Provider>
  );
};

import { Thread } from "openai/resources/beta/threads/threads";
import { WebSocket } from "ws";
import { openai } from "./openai";
import { AssistantName } from "./agent";

export type ChatSessionKey = string;

export interface Connection {
  ws: WebSocket;
  lastActive: number;
}

export interface ChatSession {
  chatSessionKey: ChatSessionKey;
  thread: Thread;
}

class SessionManager {
  // ip -> Connection
  private connections: Map<string, Connection>;
  private chatSessions: Map<ChatSessionKey, ChatSession>;
  public maxConnections: number;
  private timeout: number;

  constructor(maxConnections: number, timeout: number) {
    this.connections = new Map();
    this.chatSessions = new Map();
    this.maxConnections = maxConnections;
    this.timeout = timeout;
  }

  private deriveChatSessionKey(
    ip: string,
    assistantName: AssistantName
  ): ChatSessionKey {
    return ip + "_" + assistantName;
  }

  private parseChatSessionKey(chatSessionKey: ChatSessionKey) {
    const [ip, assistantName] = chatSessionKey.split("_");
    return { ip, assistantName } as {
      ip: string;
      assistantName: AssistantName;
    };
  }

  public async addConnection(ip: string, ws: WebSocket) {
    if (this.connections.size >= this.maxConnections) {
      return false; // Reached max connections
    }
    this.connections.set(ip, { ws, lastActive: Date.now() });
    return true;
  }

  public removeConnection(ip: string): void {
    const chatSessionKey1 = this.deriveChatSessionKey(ip, "Tina");
    const chatSessionKey2 = this.deriveChatSessionKey(ip, "Dong");
    this.connections.delete(ip);
    this.chatSessions.delete(chatSessionKey1);
    this.chatSessions.delete(chatSessionKey2);
  }

  public touchConnection(ip: string, assistantName: AssistantName): void {
    const chatSessionKey = this.deriveChatSessionKey(ip, assistantName);
    const connection = this.connections.get(chatSessionKey);
    if (connection) {
      connection.lastActive = Date.now();
    }
  }

  public startTimeoutCheck(): void {
    setInterval(() => {
      const currentTime = Date.now();
      this.connections.forEach((connection, ip) => {
        if (currentTime - connection.lastActive > this.timeout) {
          connection.ws.terminate(); // Terminate WebSocket connection
          this.removeConnection(ip);
        }
      });
    }, this.timeout);
  }

  public async getChatSession(ip: string, assistantName: AssistantName) {
    const chatSessionKey = this.deriveChatSessionKey(ip, assistantName);
    let chatSession = this.chatSessions.get(chatSessionKey);

    if (chatSession) {
      chatSession.thread = await openai.beta.threads.retrieve(
        chatSession.thread.id
      );
      this.chatSessions.set(chatSessionKey, chatSession);
    } else {
      chatSession = {
        chatSessionKey,
        thread: await openai.beta.threads.create(),
      };
      this.chatSessions.set(chatSessionKey, chatSession);
    }
    return chatSession;
  }
}

export const sessionManager = new SessionManager(10, 30000); // Allow 10 connections, timeout after 30 seconds

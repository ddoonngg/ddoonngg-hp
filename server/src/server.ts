import dotenv from "dotenv";
import path from "path";
import fs from "fs";
const envPath = path.resolve(__dirname, "../../", ".env");
dotenv.config({ path: envPath });
import http from "http";
import { OpenAI } from "openai";
import WebSocket from "ws";
import express from "express";
import httpProxy from "http-proxy";
import url from "url";

import { API_PORT } from "./constants";
import { Thread } from "openai/resources/beta/threads/threads";

const app = express();
const server = http.createServer(app);

// 创建一个反向代理服务器实例
const proxy = httpProxy.createProxyServer();

server.on("upgrade", function (req, socket, head) {
  // 代理WebSocket请求
  const isWebSocketRequest =
    req.headers["upgrade"] &&
    req.headers["upgrade"].toLowerCase() === "websocket";
  // 检查传入请求的协议是否为 HTTPS
  const isHttpsRequest = req.headers["x-forwarded-proto"] === "https";

  // 如果请求不是 WebSocket 或不是 HTTPS 请求，则忽略
  if (!isWebSocketRequest || !isHttpsRequest) {
    return;
  }

  if (typeof req.url === "undefined") {
    // 如果 URL 路径不存在，则打印警告并返回
    console.warn("URL path is undefined. Ignoring WebSocket request.");
    return;
  }

  // 构造目标 URL
  const targetProtocol = "ws://";
  const targetUrl = new URL(req.url, targetProtocol + req.headers.host);

  // 将 WebSocket 请求转发到目标服务器
  proxy.ws(req, socket, head, {
    target: targetUrl.href,
  });
});

function makeGetThreadIdFunc(): () => Promise<Thread> {
  let thread: Thread | null = null;
  return async () => {
    if (thread === null) {
      thread = await openai.beta.threads.create();
    }
    return thread;
  };
}

// const options = {
//   key: fs.readFileSync(path.resolve(__dirname, "../private.key")),
//   cert: fs.readFileSync(path.resolve(__dirname, "../certificate.pem")),
// };

const options = {};

const wss = new WebSocket.Server({ server });
const openai = new OpenAI();
const getThread = makeGetThreadIdFunc();

wss.on("connection", function connection(ws) {
  console.log("Client connected to WebSocket server");

  // WebSocket message event
  ws.on("message", async function incoming(incomingMessage: string) {
    console.log("Received message:", incomingMessage);
    // Echo the message back to the client

    const thread = await getThread();
    const message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: incomingMessage.toString(),
    });
    const run = openai.beta.threads.runs
      .createAndStream(thread.id, {
        assistant_id: "asst_OArPSctD6lVNo6wpcxm7Jwws",
      })
      .on("textCreated", (text) => process.stdout.write("\nassistant > "))
      .on("textDelta", (textDelta, snapshot) => ws.send(textDelta.value || ""))
      .on("toolCallCreated", (toolCall) =>
        process.stdout.write(`\nassistant > ${toolCall.type}\n\n`)
      )
      .on("toolCallDelta", (toolCallDelta, snapshot) => {
        if (toolCallDelta.type === "code_interpreter") {
          if (toolCallDelta.code_interpreter?.input) {
            process.stdout.write(toolCallDelta.code_interpreter.input);
          }
          if (toolCallDelta.code_interpreter?.outputs) {
            process.stdout.write("\noutput >\n");
            toolCallDelta.code_interpreter.outputs.forEach((output) => {
              if (output.type === "logs") {
                process.stdout.write(`\n${output.logs}\n`);
              }
            });
          }
        }
      })
      .on("end", () => {
        ws.send("EEENNNDDD");
      });
  });

  // WebSocket close event
  ws.on("close", function close() {
    console.log("Client disconnected from WebSocket server");
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "public")));
}

app.use(express.json());
app.post("/chat", async (req, res) => {
  try {
    res.json({ message: "Hello, World!" });
  } catch (e: unknown) {
    // 'e' is typed as 'unknown'
    if (e instanceof Error) {
      res.status(500).json({ error: e.message });
    }
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", version: "2.2." });
});

server.listen(API_PORT, () => {
  console.log(`Express server is listening at ${API_PORT}`);
});

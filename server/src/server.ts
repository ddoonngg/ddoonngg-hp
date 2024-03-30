import dotenv from "dotenv";
import path from "path";
import fs from "fs";
const envPath = path.resolve(__dirname, "../../", ".env");
dotenv.config({ path: envPath });
import http from "http";
import { OpenAI } from "openai";
import WebSocket from "ws";
import express from "express";
import { API_PORT } from "./constants";
import { Thread } from "openai/resources/beta/threads/threads";

const app = express();
const server = http.createServer(app);

const httpProxy = require("http-proxy");
const url = require("url");

// 创建一个反向代理服务器实例
const proxy = httpProxy.createProxyServer();

// 在 Express 应用程序中进行 WebSocket 转发等其他操作
app.use((req, res, next) => {
  // 检查传入请求的协议
  console.log("request from passing to prxoxy", req);
  const isWebSocketRequest =
    req.headers["upgrade"] &&
    req.headers["upgrade"].toLowerCase() === "websocket";
  const targetProtocol = isWebSocketRequest ? "ws://" : "http://";

  // 解析请求 URL
  const targetUrl = url.parse(targetProtocol + req.headers.host + req.url);

  // 将请求转发到目标服务器
  proxy.web(req, res, {
    target: targetUrl,
    ws: isWebSocketRequest, // 如果是 WebSocket 请求，设置为 true
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

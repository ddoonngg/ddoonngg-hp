import path from "path";
import http from "http";
import { OpenAI } from "openai";
import WebSocket from "ws";
import express from "express";
import { API_PORT, TINA_AGENT_ID } from "./constants";
import { Thread } from "openai/resources/beta/threads/threads";
import { getAgentId } from "./agent";

const openai = new OpenAI();
function makeGetThreadIdFunc(): () => Promise<Thread> {
  let thread: Thread | null = null;
  return async () => {
    if (thread === null) {
      thread = await openai.beta.threads.create();
    }
    return thread;
  };
}

const app = express();
const server = http.createServer({}, app);
const wss = new WebSocket.Server({ server });

const getThread = makeGetThreadIdFunc();
console.log(process.env.DONG_AGENT_ID);
wss.on("connection", function connection(ws) {
  console.log(`TINA_AGENT_ID: ${TINA_AGENT_ID}`);

  console.log("Client connected to WebSocket server");

  // WebSocket message event
  ws.on("message", async function incoming(incomingMessage: string) {
    console.log("Received message:", JSON.parse(incomingMessage));

    const { assistantName } = JSON.parse(incomingMessage);
    // Echo the message back to the client

    const thread = await getThread();
    const message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: incomingMessage.toString(),
    });
    const run = openai.beta.threads.runs
      .createAndStream(thread.id, {
        assistant_id: getAgentId(assistantName),
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
  console.log('Serving static files from "public" directory');
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
  console.log('GET "/health"');
  res.json({ status: "ok", version: "1.0.0" });
});

server.listen(API_PORT, () => {
  console.log(`Express server is listening at ${API_PORT}`);
});

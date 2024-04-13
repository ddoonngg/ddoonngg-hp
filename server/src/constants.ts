import dotenv from "dotenv";
import path from "path";
const envPath = path.resolve(__dirname, "../../", ".env");
dotenv.config({ path: envPath });

export const API_PORT = "8080";
export const TINA_AGENT_ID = process.env.TINA_AGENT_ID as string;
export const DONG_AGENT_ID = process.env.TINA_AGENT_ID as string;

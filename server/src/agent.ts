import { DONG_AGENT_ID, TINA_AGENT_ID } from "./constants";

export type AssistantName = "Tina" | "Dong";

export function getAgentId(assistantName: "Tina" | "Dong"): string {
  switch (assistantName) {
    case "Tina":
      return TINA_AGENT_ID;
    case "Dong":
      return DONG_AGENT_ID;
    default:
      throw new Error(`Unknown agent name: ${assistantName}`);
  }
}

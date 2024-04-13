import { DONG_AGENT_ID, TINA_AGENT_ID } from "./constants";

export function getAgentId(agentName: "Tina" | "Dong"): string {
  switch (agentName) {
    case "Tina":
      return TINA_AGENT_ID;
    case "Dong":
      return DONG_AGENT_ID;
    default:
      throw new Error(`Unknown agent name: ${agentName}`);
  }
}

export interface Message {
  from: "User" | "Assistant";
  data: string;
}

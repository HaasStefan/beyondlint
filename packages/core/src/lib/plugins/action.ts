import { Message } from "../message.js";
import { Name } from "../name.js";

export interface Action {
  name: Name;
  description?: string;
  options?: Record<string, any>;
  isEnabled?: boolean;
  run: (ruleMessage: Message) => Promise<void>;
}
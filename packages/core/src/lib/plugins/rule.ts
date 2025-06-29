import { Message } from "../message.js";
import { Name } from "../name.js";

export interface Rule<T extends object = any, MessageAdditionalInfo = any> {
  name: Name;
  description?: string;
  run: (options: T) => Promise<T | null>;
  format: (result: T) => Message<MessageAdditionalInfo>;
  isEnabled: (options: T) => boolean;
}
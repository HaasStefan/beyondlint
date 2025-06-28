import { Message } from "../message.js";

export interface Rule<T extends object, MessageAdditionalInfo> {
  name: string;
  description: string;
  version: string;
  run: (options: T) => Promise<T | null>;
  format: (result: T) => Message<MessageAdditionalInfo>;
  isEnabled: (options: T) => boolean;
}
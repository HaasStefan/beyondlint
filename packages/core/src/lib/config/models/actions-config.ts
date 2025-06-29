import { Name } from "../../name.js";

export type ActionsConfig = Record<Name, ActionConfig>;
export interface ActionConfig {
  enabled?: boolean;
  forwardMessage?: boolean;
  forwardResult?: boolean;
  options?: Record<string, unknown>;
}
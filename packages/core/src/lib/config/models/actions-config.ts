import { Name } from "../../name.js";

export type ActionsConfig = Record<Name, ActionConfig>;
export interface ActionConfig {
  enabled?: boolean;
  options?: Record<string, unknown>;
}
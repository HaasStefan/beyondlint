import { Name } from "../../name.js";
import { ActionsConfig } from "./actions-config.js";

export type RulesConfig = Record<Name, RuleConfig>;
export interface RuleConfig {
  enabled?: boolean;
  options?: Record<string, unknown>;
  actions?: ActionsConfig;
}
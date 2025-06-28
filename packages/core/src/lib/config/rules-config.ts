import { ActionsConfig } from "./actions-config.js";


export type RuleName = `@${string}/${string}`;
export type RulesConfig = Record<RuleName, RuleConfig>;

export interface RuleConfig {
  enabled?: boolean;
  options?: Record<string, unknown>;
  actions?: ActionsConfig;
}
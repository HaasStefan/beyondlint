import { RuleConfig } from "./rules-config.js";

export interface ProjectConfig {
  extends: string;
  tsconfigPath: string;
  rules?: Record<string, RuleConfig>;
}
import { Name } from "../../name.js";
import { ActionsConfig } from "./actions-config.js";

export type RulesConfig = Record<Name, RuleConfig>;
export interface RuleConfig {
  enabled: boolean;
  processingMode: ProcessingMode;
  options: Record<string, unknown>;
  actions: ActionsConfig;
}

/**
 * Defines how a rule should be processed.
 * - `project`: The rule is processed at the project level, considering all files in the project.
 * - `file`: The rule is processed at the file level, focusing on individual files. file by file.
 */
export type ProcessingMode = "project" | "file";

export const DEFAULT_PROCESSING_MODE: ProcessingMode = "file";
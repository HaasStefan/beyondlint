import { RulesConfig } from "./rules-config.js";

export type PluginName = `@${string}/${string}`;

export interface PluginConfig {
  plugin: PluginName;
  options?: Record<string, unknown>;
}

export interface BaseConfig {
  plugins?: (PluginName | PluginConfig)[];
  rules?: RulesConfig;
}

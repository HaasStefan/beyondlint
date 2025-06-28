import { RulesConfig } from "./rules-config.js";

export type PluginName = `@${string}/${string}`;

export interface PluginConfig {
  plugin: PluginName;
  options?: Record<string, unknown>;
}

export type Plugin = PluginName | PluginConfig;
export type Plugins = Plugin[];

export interface BaseConfig {
  plugins?: Plugins;
  rules?: RulesConfig;
}

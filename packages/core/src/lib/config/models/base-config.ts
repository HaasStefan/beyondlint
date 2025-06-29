import { Name } from "../../name.js";
import { RulesConfig } from "./rules-config.js";

export interface PluginConfig {
  plugin: Name;
  options?: Record<string, unknown>;
}

export type Plugin = Name | PluginConfig;
export type Plugins = Plugin[];

export interface BaseConfig {
  plugins?: Plugins;
  rules?: RulesConfig;
}

export type MergedConfig = BaseConfig & {
  sourceRoot: string;
  tsconfigPath: string;
};
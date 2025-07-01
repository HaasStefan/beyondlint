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
  gitOptions: GitOptions;
  rules?: RulesConfig;
}

export interface GitOptions {
  base?: string;
  head?: string;
}

export const DEFAULT_GIT_OPTIONS: GitOptions = {
  base: "origin/main",
  head: "HEAD",
}; 

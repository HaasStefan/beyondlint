import { BaseConfig } from "./base-config.js";

export type MergedConfig = BaseConfig & {
  sourceRoot: string;
  tsconfigPath: string;
};
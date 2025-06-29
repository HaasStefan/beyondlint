import { BaseConfig } from "./models/base-config.js";
import { ProjectConfig } from "./models/project-config.js";

/**
 * Merges a project configuration with the base configuration and all parent configurations of the project.
 * E.g.: trident/libs/hello/.beyondlint.json --> trident/.beyondlint.json --> .beyondlint.base.json
 */
export function mergeProjectConfigWithBaseConfig(
  projectConfig: ProjectConfig,
  baseConfig: BaseConfig
): MergedConfig {
  // TODO

}
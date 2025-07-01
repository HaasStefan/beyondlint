import { BaseConfig } from './base-config.js';
import { ProjectConfig } from './project-config.js';

/**
 * ConfigFileMap is a record that maps configuration file paths to an array of file paths.
 * This structure is useful for tracking which files are associated with each configuration file.
 * @example
 * const configFileMap: ConfigFileMap = {
 *   "trident/libs/hello/.beyondlint.json": [
 *      "trident/libs/hello/src/index.ts",
 *      "trident/libs/hello/src/utils.ts",
 *   ],
 * };
 */
export type ConfigFileMap = Record<string, string[]>;

/**
 * ConfigMap is a record that maps configuration file paths to their respective configurations.
 * It can contain both ProjectConfig and BaseConfig types.
 * This structure allows for easy access and management of configurations across different projects.
 * @example
 * const configMap: ConfigMap = {
 *   "trident/libs/hello/.beyondlint.json": {...},
 * };
 */
export type ConfigMap = Record<string, ProjectConfig | BaseConfig>;

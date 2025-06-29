import { BaseConfig } from './models/base-config.js';
import { MergedConfig } from './models/merged-config.js';
import { ProjectConfig } from './models/project-config.js';
import { ConfigParser } from './parser/parser.js';

/**
 * Merges a project configuration with the base configuration and all parent configurations of the project.
 * E.g.: trident/libs/hello/.beyondlint.json --> trident/.beyondlint.json --> .beyondlint.base.json
 */
export function getFullProjectConfiguration(
  projectConfigPath: string,
  baseConfig: BaseConfig
): MergedConfig {
  const parser = ConfigParser.getInstance();
  const projectConfig = parser.parseProjectConfig(projectConfigPath);
  const projectConfigStack = getProjectConfigStack(projectConfig);

  let tsconfigPath: string | undefined = undefined;
  let sourceRoot: string | undefined = undefined;
  let rules = baseConfig.rules || {};

  for (const config of projectConfigStack) {
    tsconfigPath = config.tsconfigPath;
    sourceRoot = config.sourceRoot;

    rules = {
      ...rules,
      ...config.rules,
    };
  }

  if (!tsconfigPath) {
    throw new Error(
      `No tsconfigPath found in project configuration stack for ${projectConfigPath}.`
    );
  }

  if (!sourceRoot) {
    throw new Error(
      `No sourceRoot found in project configuration stack for ${projectConfigPath}.`
    );
  }

  return {
    ...baseConfig,
    tsconfigPath,
    sourceRoot,
    rules,
  };
}

/**
 * @returns A stack of project configurations starting from the base configuration up to the project configuration.
 */
function getProjectConfigStack(projectConfig: ProjectConfig): ProjectConfig[] {
  const stack: ProjectConfig[] = [];
  let currentConfig: ProjectConfig | null = projectConfig;

  while (currentConfig) {
    stack.push(currentConfig);
    currentConfig = ConfigParser.getInstance().parseProjectConfig(
      currentConfig.extends
    );
  }

  return stack.reverse();
}

import { join } from 'node:path';
import { MergedConfig } from '../models/merged-config.js';
import { ProjectConfig } from '../models/project-config.js';
import { ConfigParser } from '../parser/parser.js';
import { existsSync } from 'node:fs';

/**
 * Merges a project configuration with the base configuration and all parent configurations of the project.
 * E.g.: trident/libs/hello/.beyondlint.json --> trident/.beyondlint.json --> .beyondlint.base.json
 */
export function mergeProjectConfiguration(
  projectConfigPath: string
): MergedConfig {
  const parser = ConfigParser.getInstance();
  const projectConfig = parser.parseProjectConfig(projectConfigPath);
  const projectConfigStack = getProjectConfigStack(projectConfig, projectConfigPath);
  const baseConfig = parser.baseConfig;

  let tsconfigPath: string | undefined = undefined;
  let sourceRoot: string | undefined = undefined;
  let rules = baseConfig.rules || {};

  for (const config of projectConfigStack) {
    tsconfigPath = config.tsconfigPath || tsconfigPath;
    sourceRoot = config.sourceRoot || sourceRoot;

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
function getProjectConfigStack(projectConfig: ProjectConfig, projectConfigPath: string): ProjectConfig[] {
  const stack: ProjectConfig[] = [];
  let currentConfig: ProjectConfig | null = projectConfig;
  let currentConfigPath = projectConfigPath.split('/').slice(0, -1).join('/');

  while (currentConfig.extends) {
    const currentConfigDir = currentConfigPath.split('/').slice(0, -1).join('/');
    const extendsPath = join(currentConfigDir, currentConfig.extends);
    
    stack.push(currentConfig);
    if (!existsSync(extendsPath)) {
      break;
    }

    currentConfigPath = extendsPath;
    currentConfig = ConfigParser.getInstance().parseProjectConfig(
      extendsPath
    );
  }

  return stack.reverse();
}

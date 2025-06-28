import { readFileSync } from 'node:fs';
import { BaseConfig, Plugins } from './models/base-config.js';
import { isName } from './utils/name-parser.js';
import { RulesConfig } from './models/rules-config.js';

export class ConfigParser {
  private baseConfig: BaseConfig;

  constructor() {}

  parseBaseConfig(workspaceRoot = '') {
    const configPath = `${workspaceRoot}/.beyondlint.base.json`;

    try {
      const configContent = readFileSync(configPath, 'utf-8');
      const json = JSON.parse(configContent);

      if (typeof json !== 'object' || json === null || Array.isArray(json)) {
        throw new Error('Base config must be a valid JSON object');
      }

      const plugins = parsePlugins(json);
      const rules = parseRules(json);
      
    } catch (error) {
      throw new Error(
        `Failed to read config file at ${configPath}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}

function parsePlugins(json: any): Plugins {
  if (!Object.keys(json).includes('plugins')) {
    return [];
  }

  if (!Array.isArray(json.plugins)) {
    throw new Error('Plugins must be an array');
  }

  return json.plugins.map((plugin: any) => {
    if (typeof plugin === 'string' && isName(plugin)) {
      return { plugin };
    }

    if (
      typeof plugin === 'object' &&
      plugin !== null &&
      'plugin' in plugin &&
      isName(plugin.plugin)
    ) {
      return { plugin: plugin.plugin, options: plugin.options || {} };
    }

    throw new Error(`Invalid plugin format: ${JSON.stringify(plugin)}`);
  });
}

function parseRules(json: any): RulesConfig {
  // TODO
}
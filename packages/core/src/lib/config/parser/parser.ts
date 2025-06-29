import { readFileSync } from 'node:fs';
import { BaseConfig, Plugins } from '../models/base-config.js';
import { isName } from '../utils/name-parser.js';
import { RuleConfig, RulesConfig } from '../models/rules-config.js';
import { ActionsConfig } from '../models/actions-config.js';
import { ProjectConfig } from '../models/project-config.js';

export class ConfigParser {
  private readonly baseConfig: BaseConfig;
  private static instance: ConfigParser;

  private constructor() {
    this.baseConfig = this.parseBaseConfig();
  }

  static getInstance(): ConfigParser {
    if (!ConfigParser.instance) {
      ConfigParser.instance = new ConfigParser();
    }
    return ConfigParser.instance;
  }

  parseBaseConfig(workspaceRoot = ''): BaseConfig {
    const configPath =
      workspaceRoot === ''
        ? '.beyondlint.base.json'
        : `${workspaceRoot}/.beyondlint.base.json`;

    try {
      const configContent = readFileSync(configPath, 'utf-8');
      const json = JSON.parse(configContent);

      if (typeof json !== 'object' || json === null || Array.isArray(json)) {
        throw new Error('Base config must be a valid JSON object');
      }

      const plugins = parsePlugins(json);
      const rules = parseRules(json);

      return {
        plugins,
        rules,
      };
    } catch (error) {
      throw new Error(
        `Failed to read config file at ${configPath}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Parses a project configuration file (.beyondlint.json) and returns a ProjectConfig object.
   * Note: It does not merge with the base config!
   */
  parseProjectConfig(filePath: string): ProjectConfig {
    try {
      const configContent = readFileSync(filePath, 'utf-8');
      const json = JSON.parse(configContent);

      if (typeof json !== 'object' || json === null || Array.isArray(json)) {
        throw new Error('Project config must be a valid JSON object');
      }

      const objectKeys = Object.keys(json);
      
      if (!objectKeys.includes('extends') && typeof json.extends !== 'string') {
        throw new Error('Project config must have a valid "extends" property');
      }

      const extendsConfig = json.extends as string;
      const sourceRoot = objectKeys.includes('sourceRoot') ? json.sourceRoot : null; // null for nested inheritance
      const tsconfigPath = objectKeys.includes('tsconfigPath') ? json.tsconfigPath : null;
      const rules = parseRules(json);

      return {
        extends: extendsConfig,
        sourceRoot,
        tsconfigPath,
        rules
      };

    } catch (error) {
      throw new Error(
        `Failed to read project config file at ${filePath}: ${
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
  if (!Object.keys(json).includes('rules')) {
    return {};
  }

  if (
    typeof json.rules !== 'object' ||
    json.rules === null ||
    Array.isArray(json.rules)
  ) {
    throw new Error('Rules must be an object');
  }

  const rules: RulesConfig = {};

  for (const [name, rule] of Object.entries(json.rules)) {
    if (!isName(name)) {
      throw new Error(`Invalid rule name: ${name}`);
    }

    if (typeof rule !== 'object' || rule === null) {
      throw new Error(`Rule configuration for ${name} must be an object`);
    }

    const ruleConfig = parseRule(rule);
    rules[name] = ruleConfig;
  }

  return rules;
}

function parseRule(rule: any): RuleConfig {
  if (typeof rule !== 'object' || rule === null) {
    throw new Error('Rule configuration must be an object');
  }

  const objectKeys = Object.keys(rule);

  const enabled = objectKeys.includes('enabled') ? Boolean(rule.enabled) : true;
  const options = objectKeys.includes('options') ? rule.options : {};

  if (typeof options !== 'object' || options === null) {
    throw new Error('Rule options must be an object');
  }

  const actions = objectKeys.includes('actions')
    ? parseActions(rule.actions)
    : {};

  return {
    enabled,
    options,
    actions,
  };
}

function parseActions(actions: any): ActionsConfig {
  if (typeof actions !== 'object' || actions === null) {
    throw new Error('Actions must be an object');
  }

  const actionsConfig: ActionsConfig = {};

  for (const [name, action] of Object.entries(actions)) {
    if (!isName(name)) {
      throw new Error(`Invalid action name: ${name}`);
    }

    if (typeof action !== 'object' || action === null) {
      throw new Error(`Action configuration for ${name} must be an object`);
    }

    const objectKeys = Object.keys(action);
    const enabled = objectKeys.includes('enabled')
      ? Boolean((action as any).enabled)
      : true;
    const forwardMessage = objectKeys.includes('forwardMessage')
      ? Boolean((action as any).forwardMessage)
      : false;
    const forwardResult = objectKeys.includes('forwardResult')
      ? Boolean((action as any).forwardResult)
      : false;
    const options = objectKeys.includes('options')
      ? (action as any).options
      : {};

    if (typeof options !== 'object' || options === null) {
      throw new Error(`Options for action ${name} must be an object`);
    }

    actionsConfig[name] = {
      enabled,
      forwardMessage,
      forwardResult,
      options,
    };
  }

  return actionsConfig;
}

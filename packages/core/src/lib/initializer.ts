import { ConfigFileMap, ConfigMap } from './config/models/config-map.js';
import { ConfigParser } from './config/parser/parser.js';
import { getChangedFilesInDiff } from './files/changed-files.js';
import { findNextProjectConfig } from './files/find-next-project-config.js';

export class Initializer {
  private static instance: Initializer;
  private readonly configFileMap: ConfigFileMap = {};
  private readonly configMap: ConfigMap = {};
  private readonly parser = ConfigParser.getInstance();

  private constructor() {
    // Private constructor to prevent instantiation
  }

  static getInstance(): Initializer {
    if (!Initializer.instance) {
      Initializer.instance = new Initializer();
    }
    return Initializer.instance;
  }

  initialize() {
    const baseConfig = this.parser.baseConfig;
    const baseConfigFilePath = this.parser.baseConfigFilePath;
    if (!baseConfig || !baseConfigFilePath) {
      throw new Error(
        'Base config is not initialized. Please ensure the base config is set before initialization.'
      );
    }

    this.configMap[baseConfigFilePath] = baseConfig;

    const gitOptions = baseConfig.gitOptions;
    const files = getChangedFilesInDiff(gitOptions);

    for (const file of files) {
      const configFilePath = findNextProjectConfig(file);
      if (this.configFileMap[configFilePath]) {
        this.configFileMap[configFilePath].push(file);
      } else {
        this.configFileMap[configFilePath] = [file];
        const projectConfig = this.parser.parseProjectConfig(configFilePath);
        this.configMap[configFilePath] = projectConfig;
      }
    }
  }
}

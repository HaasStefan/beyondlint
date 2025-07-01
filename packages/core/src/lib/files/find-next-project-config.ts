import { existsSync } from 'node:fs';

export function findNextProjectConfig(filePath: string) {
  const fragments = filePath.split('/');

  for (let i = fragments.length - 1; i >= 0; i--) {
    const currentPath = fragments.slice(0, i + 1).join('/');
    const projectConfigFile = `${currentPath}/.beyondlint.json`;
    const baseConfigFile = `${currentPath}/.beyondlint.base.json`;

    if (existsSync(projectConfigFile)) {
      return projectConfigFile;
    }
    if (existsSync(baseConfigFile)) {
      return baseConfigFile;
    }
  }

  throw new Error(`No surrounding project config, nor base config found for file: ${filePath}`);
}
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { mergeProjectConfiguration } from './merge.js';
import { join } from 'node:path';

describe('merge', () => {
  const tempFolder = join('tmp/core/src/lib/config/parser/merge');

  beforeEach(() => {
    process.env.BEYONDLINT_WORKSPACE_ROOT = tempFolder;

    mkdirSync(`${tempFolder}/trident/libs/hello`, { recursive: true });

    writeFileSync(`${tempFolder}/.beyondlint.base.json`, JSON.stringify(mockBaseConfig, null, 4));
    writeFileSync(
      `${tempFolder}/trident/.beyondlint.json`,
      JSON.stringify(mockNestedProjectConfig, null, 4)
    );
    writeFileSync(
      `${tempFolder}/trident/libs/hello/.beyondlint.json`,
      JSON.stringify(mockProjectConfig, null, 4)
    );
  });

  afterEach(() => {
    rmSync(tempFolder, { recursive: true, force: true });
  });

  it('should merge base config with project config', () => {
    const mergedConfig = mergeProjectConfiguration(
      `${tempFolder}/trident/libs/hello/.beyondlint.json`
    );

    expect(mergedConfig).toEqual(expectedMergedConfig);
  });
});

const mockBaseConfig = {
  plugins: [
    '@beyondlint/dependencies',
    {
      plugin: '@beyondlint/github',
      options: {
        token: '${GITHUB_TOKEN}',
      },
    },
  ],
  rules: {
    '@beyondlint/internal-dependency-added': {
      enabled: true,
      options: {
        allowList: [],
        gitOptions: {
          base: 'main',
          head: 'HEAD',
        },
      },
      actions: {
        '@beyondlint/github-pr-comment': {
          enabled: true,
          options: {
            resolved: 'false',
          },
        },
        '@beyondlint/github-create-issue': {
          enabled: true,
          options: {
            linkToPullRequest: true,
          },
        },
      },
    },
  },
};

const mockNestedProjectConfig = {
  extends: '../.beyondlint.json',
  sourceRoot: 'src',
  rules: {
    '@beyondlint/internal-dependency-added': {
      enabled: false,
    },
  },
};

const mockProjectConfig = {
  extends: '../../.beyondlint.json',
  sourceRoot: './src',
  tsconfigPath: './tsconfig.json',
  rules: {
    '@beyondlint/internal-dependency-added': {
      enabled: true,
      options: {
        allowList: ['@beyondlint/abc'],
        gitOptions: {
          base: 'b21e8019ed34641b337113b1861a048f75708267',
          head: '745e0ba74b466fadfd05da984d600a2e6b21fa80',
        },
      },
      actions: {
        '@beyondlint/github-pr-comment': {
          enabled: false,
        },
        '@beyondlint/github-create-issue': {
          enabled: true,
          options: {
            linkToPullRequest: false,
          },
        },
      },
    },
  },
};

const expectedMergedConfig = {
  plugins: [
    {
      plugin: '@beyondlint/dependencies',
      options: {},
    },
    {
      plugin: '@beyondlint/github',
      options: {
        token: '${GITHUB_TOKEN}',
      },
    },
  ],
  rules: {
    '@beyondlint/internal-dependency-added': {
      enabled: true,
      options: {
        allowList: ['@beyondlint/abc'],
        gitOptions: {
          base: 'b21e8019ed34641b337113b1861a048f75708267',
          head: '745e0ba74b466fadfd05da984d600a2e6b21fa80',
        },
      },
      actions: {
        '@beyondlint/github-pr-comment': {
          enabled: false,
          options: {},
        },
        '@beyondlint/github-create-issue': {
          enabled: true,
          options: {
            linkToPullRequest: false,
          },
        },
      },
    },
  },
  sourceRoot: './src',
  tsconfigPath: './tsconfig.json',
};

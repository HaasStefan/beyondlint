import { rmSync } from 'node:fs';
import { mergeProjectConfiguration } from './merge.js';
import { join } from 'node:path';
import { setupMockConfigFiles } from '../../testing/config.mock.js';

describe('merge', () => {
  const tempFolder = join('tmp/core/src/lib/config/parser/merge');

  beforeEach(() => {
    setupMockConfigFiles(tempFolder);
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
  gitOptions: {
    base: 'b21e8019ed34641b337113b1861a048f75708267',
    head: '745e0ba74b466fadfd05da984d600a2e6b21fa80',
  },
  rules: {
    '@beyondlint/internal-dependency-added': {
      enabled: true,
      processingMode: 'file',
      options: {
        allowList: ['@beyondlint/abc'],
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

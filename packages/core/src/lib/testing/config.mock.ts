import { mkdirSync, writeFileSync } from "node:fs";

export const mockBaseConfig = {
  plugins: [
    '@beyondlint/dependencies',
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
      processingMode: 'project',
      options: {
        allowList: [],
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

export const mockNestedProjectConfig = {
  extends: '../.beyondlint.json',
  sourceRoot: 'src',
  rules: {
    '@beyondlint/internal-dependency-added': {
      enabled: false,
    },
  },
};

export const mockProjectConfig = {
  extends: '../../.beyondlint.json',
  sourceRoot: './src',
  tsconfigPath: './tsconfig.json',
  rules: {
    '@beyondlint/internal-dependency-added': {
      enabled: true,
      options: {
        allowList: ['@beyondlint/abc'],
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

export function setupMockConfigFiles(tempFolder: string, overwrites?: {
  baseConfig?: Partial<typeof mockBaseConfig>,
  nestedProjectConfig?: Partial<typeof mockNestedProjectConfig>,
  projectConfig?: Partial<typeof mockProjectConfig>,
}): void {
  process.env.BEYONDLINT_WORKSPACE_ROOT = tempFolder;

  mkdirSync(`${tempFolder}/trident/libs/hello`, { recursive: true });

  const baseConfig = { ...mockBaseConfig, ...overwrites?.baseConfig };
  const nestedProjectConfig = { ...mockNestedProjectConfig, ...overwrites?.nestedProjectConfig };
  const projectConfig = { ...mockProjectConfig, ...overwrites?.projectConfig };

  writeFileSync(
    `${tempFolder}/.beyondlint.base.json`,
    JSON.stringify(baseConfig, null, 4)
  );
  writeFileSync(
    `${tempFolder}/trident/.beyondlint.json`,
    JSON.stringify(nestedProjectConfig, null, 4)
  );
  writeFileSync(
    `${tempFolder}/trident/libs/hello/.beyondlint.json`,
    JSON.stringify(projectConfig, null, 4)
  );
}

import { getChangedFilesInDiff } from './changed-files.js';

describe('getChangedFilesInDiff', () => {
  it('should return an array of changed files between two commits', () => {
    const base = 'b99c1d2d0651079c13ca0862f7d180aa030fcf3d';
    const head = 'ace46d449ac7bf9879c714ca056a0b094c2ca8a4';
    const changedFiles = getChangedFilesInDiff(base, head);

    expect(Array.isArray(changedFiles)).toBe(true);
    expect(changedFiles).toEqual(expect.arrayContaining(expectedFiles));
  });
});

const expectedFiles = [
  'README.md',
  'TODO.md',
  'packages/core/src/lib/config/models/actions-config.ts',
  'packages/core/src/lib/config/parser/merge.spec.ts',
  'packages/core/src/lib/config/parser/parser-utils.ts',
  'packages/core/src/lib/config/parser/parser.ts',
  'packages/core/src/lib/name.ts',
  'packages/docs/.gitignore',
  'packages/docs/README.md',
  'packages/docs/blog/2019-05-28-first-blog-post.md',
  'packages/docs/blog/2019-05-29-long-blog-post.md',
  'packages/docs/blog/2021-08-01-mdx-blog-post.mdx',
  'packages/docs/blog/2021-08-26-welcome/docusaurus-plushie-banner.jpeg',
  'packages/docs/blog/2021-08-26-welcome/index.md',
  'packages/docs/blog/authors.yml',
  'packages/docs/blog/tags.yml',
  'packages/docs/docs/intro.md',
  'packages/docs/docs/tutorial-basics/_category_.json',
  'packages/docs/docs/tutorial-basics/congratulations.md',
  'packages/docs/docs/tutorial-basics/create-a-blog-post.md',
  'packages/docs/docs/tutorial-basics/create-a-document.md',
  'packages/docs/docs/tutorial-basics/create-a-page.md',
  'packages/docs/docs/tutorial-basics/deploy-your-site.md',
  'packages/docs/docs/tutorial-basics/markdown-features.mdx',
  'packages/docs/docs/tutorial-extras/_category_.json',
  'packages/docs/docs/tutorial-extras/img/docsVersionDropdown.png',
  'packages/docs/docs/tutorial-extras/img/localeDropdown.png',
  'packages/docs/docs/tutorial-extras/manage-docs-versions.md',
  'packages/docs/docs/tutorial-extras/translate-your-site.md',
  'packages/docs/docusaurus.config.ts',
  'packages/docs/package.json',
  'packages/docs/sidebars.ts',
  'packages/docs/src/components/HomepageFeatures/index.tsx',
  'packages/docs/src/components/HomepageFeatures/styles.module.css',
  'packages/docs/src/css/custom.css',
  'packages/docs/src/pages/index.module.css',
  'packages/docs/src/pages/index.tsx',
  'packages/docs/src/pages/markdown-page.md',
  'packages/docs/static/.nojekyll',
  'packages/docs/static/img/beyondlint.png',
  'packages/docs/static/img/ci.png',
  'packages/docs/static/img/docusaurus-social-card.jpg',
  'packages/docs/static/img/docusaurus.png',
  'packages/docs/static/img/enterprise.png',
  'packages/docs/static/img/extendable.png',
  'packages/docs/static/img/favicon.ico',
  'packages/docs/static/img/logo.svg',
  'packages/docs/static/img/undraw_docusaurus_mountain.svg',
  'packages/docs/static/img/undraw_docusaurus_react.svg',
  'packages/docs/static/img/undraw_docusaurus_tree.svg',
  'packages/docs/tsconfig.json',
  'pnpm-lock.yaml',
] as const;

import { exec } from 'node:child_process';
import { getAllDeps } from './utils/get-all-deps.js';
import { pruneExternalDeps } from './utils/external-deps.js';
import { DependencyAddedResult } from './utils/models.js';
import { ConfigParser } from '@beyondlint/core';
import { GitOptions } from '@beyondlint/core';

export async function dependencyAddedRule(
  projectRoot: string,
  allowList: string[],
): Promise<DependencyAddedResult | null> {
  const { gitOptions } = ConfigParser.getInstance().baseConfig;
  const { added } = await getLinesFromGitDiffAsync(projectRoot, gitOptions);
  const imports = added.filter(
    (line) =>
      line.startsWith('import') ||
      // match regex for dynamic imports
      line.match(/import\(['"][^'"]+['"]\)/) ||
      line.match(/require\(['"][^'"]+['"]\)/)
  );
  if (imports.length === 0) {
    return null; // No imports added
  }

  const workspaceRoot = process.env['BEYONDLINT_WORKSPACE_ROOT'] || './';
  const allDeps = getAllDeps(projectRoot);
  const addedModuleSpecifiers = imports
    .map((line) => {
      const match = line.match(/['"]([^'"]+)['"]/);
      return match ? match[1] : null;
    })
    .filter(
      (moduleSpecifier): moduleSpecifier is string => moduleSpecifier !== null
    )
    .filter(
      (moduleSpecifier) =>
        !moduleSpecifier.startsWith('.') && !moduleSpecifier.includes(':')
    );

  const deps = pruneExternalDeps(addedModuleSpecifiers, workspaceRoot);

  const gitDiffModuleSpecifierCounts = deps.reduce((acc, moduleSpecifier) => {
    acc[moduleSpecifier] = (acc[moduleSpecifier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const violations = deps
    .map((moduleSpecifier) => {
      if (!allowList.includes(moduleSpecifier)) {
        const count =
          (allDeps[moduleSpecifier] || 0) -
            gitDiffModuleSpecifierCounts[moduleSpecifier] || 0;

        console.log(
          `Module Specifier: ${moduleSpecifier}, Count in allDeps: ${
            allDeps[moduleSpecifier] || 0
          }, Count in git diff: ${
            gitDiffModuleSpecifierCounts[moduleSpecifier] || 0
          }`,
          count
        );

        if (count <= 0) {
          return moduleSpecifier;
        }
      }

      return null;
    })
    .filter(
      (moduleSpecifier): moduleSpecifier is string => moduleSpecifier !== null
    );

  if (violations.length > 0) {
    return { moduleSpecifiers: violations, projectRoot, allowList };
  }

  return null;
}

export default dependencyAddedRule;

async function getLinesFromGitDiffAsync(
  path: string,
  gitOptions: GitOptions
): Promise<{ added: string[]; removed: string[] }> {
  const diff = await runGitDiffCommandAsync(path, gitOptions);
  const lines = diff.split('\n');
  const added: string[] = [];
  const removed: string[] = [];

  for (const line of lines) {
    if (line.startsWith('+') && !line.startsWith('+++')) {
      added.push(line.slice(1).trim());
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      removed.push(line.slice(1).trim());
    }
  }

  return {
    added,
    removed,
  };
}

async function runGitDiffCommandAsync(
  filePath: string,
  gitOptions: GitOptions
): Promise<string> {
  const { head, base } = gitOptions;
  const command = `git diff ${base}...${head} -- ${filePath}`;

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing git diff: ${error.message}`);
        reject(error);
      }
      if (stderr) {
        console.error(`Git diff stderr: ${stderr}`);
        reject(new Error(stderr));
      }
      resolve(stdout);
    });
  });
}

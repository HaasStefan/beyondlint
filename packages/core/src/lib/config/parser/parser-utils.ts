import { readdirSync, readFileSync } from 'node:fs';
import ignore from 'ignore';
import { join } from 'node:path';

export function findAllProjectConfigs(): string[] {
  const workspaceRoot = process.env.BEYONDLINT_WORKSPACE_ROOT || '';
  const gitIgnore = readGitIgnore(workspaceRoot);
  const ig = ignore().add(gitIgnore);
  const baseDirs = getBaseDirectories(workspaceRoot, ig);
  const configFiles: string[] = [];

  for (const baseDir of baseDirs) {
    const files = getConfigFilesRecursively(baseDir, ig);
    configFiles.push(...files);
  }

  if (configFiles.length === 0) {
    console.warn(
      `No .beyondlint.json project configuration files found in the workspace root: ${workspaceRoot}`
    );

    return [];
  }

  return configFiles;
}

function readGitIgnore(workspaceRoot: string): string[] {
  const gitIgnorePath =
    workspaceRoot === '' ? '.gitignore' : `${workspaceRoot}/.gitignore`;

  try {
    const gitIgnoreContent = readFileSync(gitIgnorePath, 'utf-8');
    return gitIgnoreContent
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && line.length > 0 && !line.startsWith('#'));
  } catch (error) {
    throw new Error(
      `Failed to read .gitignore file at ${gitIgnorePath}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

function getConfigFilesRecursively(dir: string, ig: ignore.Ignore): string[] {
  const configFiles: string[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = `${dir}/${entry.name}`;
    if (ig.ignores(fullPath)) {
      continue; // Skip ignored files and directories
    }

    if (entry.isDirectory()) {
      configFiles.push(...getConfigFilesRecursively(fullPath, ig));
    } else if (entry.isFile() && entry.name === '.beyondlint.json') {
      configFiles.push(fullPath);
    }
  }

  return configFiles;
}

function getBaseDirectories(
  workspaceRoot: string,
  ig: ignore.Ignore
): string[] {
  const baseDirs: string[] = [];
  const entries = readdirSync(workspaceRoot == '' ? '.' : workspaceRoot, { withFileTypes: true });

  for (const entry of entries) {
    const path = join(workspaceRoot, entry.name);
    if (
      entry.isDirectory() &&
      !entry.name.startsWith('.') &&
      !ig.ignores(path)
    ) {
      baseDirs.push(path);
    }
  }

  return baseDirs;
}

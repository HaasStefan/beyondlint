import { execSync } from "node:child_process";

export function getChangedFilesInDiff(base: string, head: string): string[] {
  const output = execSync(`git diff --name-only --diff-filter=AM ${base} ${head}`, {
    encoding: 'utf-8',
  });
  return output.split('\n').filter(Boolean);
}
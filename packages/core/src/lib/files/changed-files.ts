import { execSync } from "node:child_process";
import { GitOptions } from "../config/models/base-config.js";

export function getChangedFilesInDiff(gitOptions: GitOptions): string[] {
  const { base, head } = gitOptions;
  const output = execSync(`git diff --name-only --diff-filter=AM ${base} ${head}`, {
    encoding: 'utf-8',
  });
  return output.split('\n').filter(Boolean);
}
import { exec } from 'node:child_process';

export type DependencyAddedResult = {
  filePath: string;
  dependencyName: string;
  added: boolean;
};

type GitOptions = {
  head: string;
  base: string;
};

export async function dependencyAddedRule(
  filePath: string,
  allowList: string[],
  gitOptions: GitOptions = { head: 'HEAD', base: 'main' }
): Promise<DependencyAddedResult | null> {
  const gitDiffLines = await getLinesFromGitDiffAsync(filePath, gitOptions);

  return gitDiffLines as any as null;
}

export default dependencyAddedRule;

async function getLinesFromGitDiffAsync(
  filePath: string,
  gitOptions: GitOptions
): Promise<{ added: string[]; removed: string[] }> {
  const diff = await runGitDiffCommandAsync(filePath, gitOptions);
  console.log(`Git diff for ${filePath}:\n${diff}`);

  return {
    added: [],
    removed: [],
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

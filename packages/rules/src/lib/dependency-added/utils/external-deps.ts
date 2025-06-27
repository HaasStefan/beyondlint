import { existsSync, readFileSync } from 'node:fs';

export function pruneExternalDeps(
  deps: string[],
  workspaceRoot: string
): string[] {
  const packageJson = getPackageJson(workspaceRoot);
  const dependencies = Object.keys({
    ...packageJson['dependencies'],
    ...packageJson['devDependencies'],
  });

  console.log(`Pruning external dependencies in ${workspaceRoot}`);
  console.log(`External dependencies: ${deps.join(', ')}`);

  return deps.filter(dep => !dependencies.includes(dep));
}

function getPackageJson(workspaceRoot: string): Record<string, any> {
  const packageJsonPath = `${workspaceRoot}/package.json`;
  if (!existsSync(packageJsonPath)) {
    throw new Error(`package.json not found in ${workspaceRoot}`);
  }

  const packageJson = readFileSync(packageJsonPath, 'utf-8');
  const parsedPackageJson = JSON.parse(packageJson) as Record<string, any>;

  if (!parsedPackageJson || typeof parsedPackageJson !== 'object') {
    throw new Error(`Invalid package.json format in ${workspaceRoot}`);
  }
  return parsedPackageJson;
}

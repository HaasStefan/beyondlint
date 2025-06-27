import ts from 'typescript';
import { readdirSync, statSync } from 'fs';

export type ModuleSpecifierCountMap = Record<string, number>;

export function getAllDeps(projectRoot: string): ModuleSpecifierCountMap {
  const tsFiles = getAllTsFiles(projectRoot);

  const moduleSpecifierCountMap: ModuleSpecifierCountMap = {};

  for (const file of tsFiles) {
    const importDeclarations = getImportDeclarationsFromFile(file);
    const dynamicImports = getDynamicImportsFromFile(file);

    for (const moduleSpecifier of [...importDeclarations, ...dynamicImports]) {
      if (moduleSpecifierCountMap[moduleSpecifier]) {
        moduleSpecifierCountMap[moduleSpecifier]++;
      } else {
        moduleSpecifierCountMap[moduleSpecifier] = 1;
      }
    }
  }

  return moduleSpecifierCountMap;
}

function getImportDeclarationsFromFile(filePath: string): string[] {
  const sourceFile = ts.createSourceFile(
    filePath,
    ts.sys.readFile(filePath) || '',
    ts.ScriptTarget.ES2015,
    true
  );

  const imports: string[] = [];
  ts.forEachChild(sourceFile, function visit(node) {
    if (ts.isImportDeclaration(node) && node.moduleSpecifier) {
      const moduleName = node.moduleSpecifier
        .getText(sourceFile)
        .replace(/['"]/g, '');
      imports.push(moduleName);
    }
    ts.forEachChild(node, visit);
  });

  return imports;
}

function getDynamicImportsFromFile(filePath: string): string[] {
  const sourceFile = ts.createSourceFile(
    filePath,
    ts.sys.readFile(filePath) || '',
    ts.ScriptTarget.ES2015,
    true
  );

  const dynamicImports: string[] = [];
  ts.forEachChild(sourceFile, function visit(node) {
    if (ts.isCallExpression(node) && node.expression.getText() === 'import') {
      const moduleName = node.arguments[0]
        .getText(sourceFile)
        .replace(/['"]/g, '');
      dynamicImports.push(moduleName);
    }
    ts.forEachChild(node, visit);
  });

  return dynamicImports;
}

function getAllTsFiles(dir: string): string[] {
  let results: string[] = [];
  const list = readdirSync(dir);

  list.forEach((file) => {
    const filePath = `${dir}/${file}`;
    const stat = statSync(filePath);

    if (stat && stat.isDirectory()) {
      // Recurse into a subdirectory
      results = results.concat(getAllTsFiles(filePath));
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      // Is a .ts or .tsx file
      results.push(filePath);
    }
  });

  return results;
}

export type DependencyAddedResult = {
  moduleSpecifiers: string[];
  projectRoot: string;
  allowList: string[];
  gitOptions: GitOptions;
};

export type GitOptions = {
  head: string;
  base: string;
};
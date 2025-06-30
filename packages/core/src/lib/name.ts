
export type Name = `@${string}/${string}`;

export function isName(name: string): name is Name {
  return /^@[^/]+\/[^/]+$/.test(name);
}
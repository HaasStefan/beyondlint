
export function isName(name: string): name is `@${string}/${string}` {
  return /^@[^/]+\/[^/]+$/.test(name);
}
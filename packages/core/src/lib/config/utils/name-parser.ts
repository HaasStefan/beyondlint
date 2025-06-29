import { Name } from "../../name.js";

export function isName(name: string): name is Name {
  return /^@[^/]+\/[^/]+$/.test(name);
}
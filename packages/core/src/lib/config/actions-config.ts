 export type ActionName = `@${string}/${string}`;
 
export type ActionsConfig = Record<ActionName, ActionConfig>;
export interface ActionConfig {
  enabled?: boolean;
  forwardMessage?: boolean;
  forwardResult?: boolean;
  options?: Record<string, unknown>;
}
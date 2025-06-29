import { Name } from "../name.js";
import { Action } from "./action.js";
import { Rule } from "./rule.js";

export interface Plugin {
  name: Name;
  options?: Record<string, any>;
  rules?: Record<Name, Rule>;
  actions?: Record<Name, Action>;
}

export class ActionRegistry {
  private readonly actions: Record<Name, Action> = {};
  private static instance: ActionRegistry;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  static getInstance(): ActionRegistry {
    if (!ActionRegistry.instance) {
      ActionRegistry.instance = new ActionRegistry();
    }
    return ActionRegistry.instance;
  }

  registerAction(action: Action): void {
    if (this.actions[action.name]) {
      throw new Error(`Action with name ${action.name} is already registered.`);
    }
    this.actions[action.name] = action;
  }

  getAction(name: Name): Action | undefined {
    return this.actions[name];
  }

  getActions(): Record<Name, Action> {
    return this.actions;
  }
}

export class RuleRegistry {
  private readonly rules: Record<Name, Rule> = {};
  private static instance: RuleRegistry;
  
  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  static getInstance(): RuleRegistry {
    if (!RuleRegistry.instance) {
      RuleRegistry.instance = new RuleRegistry();
    }
    return RuleRegistry.instance;
  }

  registerRule(rule: Rule): void {
    if (this.rules[rule.name]) {
      throw new Error(`Rule with name ${rule.name} is already registered.`);
    }
    this.rules[rule.name] = rule;
  }
  
  getRule(name: Name): Rule | undefined {
    return this.rules[name];
  }

  getRules(): Record<Name, Rule> {
    return this.rules;
  }
}

export function registerPlugin(plugin: Plugin): void {
  const actionRegistry = ActionRegistry.getInstance();
  const ruleRegistry = RuleRegistry.getInstance();

  if (plugin.actions) {
    for (const action of Object.values(plugin.actions)) {
      actionRegistry.registerAction(action);
    }
  }

  if (plugin.rules) {
    for (const rule of Object.values(plugin.rules)) {
      ruleRegistry.registerRule(rule);
    }
  }
}

import { Message, MessageLevel } from "@beyondlint/core";
import { DependencyAddedResult } from "./models.js";

export function formatToMessage(result: DependencyAddedResult): Message<string[] | null> {
  const { moduleSpecifiers, projectRoot } = result;

  if (moduleSpecifiers.length === 0) {
    return {
      level: MessageLevel.DEBUG,
      text: "No new dependencies added.",
      additionalInfo: null,
    };
  }

  const messageText = `New dependencies added in project at ${projectRoot}!`;
  
  return {
    level: MessageLevel.ERROR,
    text: messageText,
    additionalInfo: moduleSpecifiers,
  };
}


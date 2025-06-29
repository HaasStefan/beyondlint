export enum MessageLevel {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

export interface Message<T = any> {
  level: MessageLevel;
  text: string;
  additionalInfo: T
}
import { LogLevel } from '@juki-team/commons';
import { LOG_LEVEL } from '../config';
import { jkLogTelegramBot } from '../services/telegram';
import { stringifyObject } from './utils';

const SHOULD_DISPLAY_LOG: { [key in LogLevel]: { [key in LogLevel]: boolean } } = {
  [LogLevel.FATAL]: {
    FATAL: true,
    ERROR: false,
    WARN: false,
    INFO: false,
    DEBUG: false,
    TRACE: false,
  },
  [LogLevel.ERROR]: {
    FATAL: true,
    ERROR: true,
    WARN: false,
    INFO: false,
    DEBUG: false,
    TRACE: false,
  },
  [LogLevel.WARN]: {
    FATAL: true,
    ERROR: true,
    WARN: true,
    INFO: false,
    DEBUG: false,
    TRACE: false,
  },
  [LogLevel.INFO]: {
    FATAL: true,
    ERROR: true,
    WARN: true,
    INFO: true,
    DEBUG: false,
    TRACE: false,
  },
  [LogLevel.DEBUG]: {
    FATAL: true,
    ERROR: true,
    WARN: true,
    INFO: true,
    DEBUG: true,
    TRACE: false,
  },
  [LogLevel.TRACE]: {
    FATAL: true,
    ERROR: true,
    WARN: true,
    INFO: true,
    DEBUG: true,
    TRACE: true,
  },
};

export const shouldDisplayLog = (logLevel: LogLevel) => {
  return SHOULD_DISPLAY_LOG[LOG_LEVEL]?.[logLevel] ?? false;
};

export const log = (logLevel: LogLevel) => (message: string, content?: any, reportAs?: 'info' | 'error') => {
  if (shouldDisplayLog(logLevel)) {
    const title = `[${logLevel}] ${new Date().toISOString()}, ${message}`;
    console.log(`${title}${content ? ': ' + stringifyObject(content, 5) : ''} `);
    if (reportAs === 'info') {
      void jkLogTelegramBot.sendInfoMessage(title, content);
    } else if (reportAs === 'error') {
      void jkLogTelegramBot.sendErrorMessage(title, content);
    }
  }
};

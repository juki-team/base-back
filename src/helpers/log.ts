import { LogLevel } from '@juki-team/commons';
import * as util from 'node:util';
import { LOG_LEVEL } from '../config';

export const shouldDisplayLog = (logLevel: LogLevel) => {
  switch (logLevel) {
    case LogLevel.FATAL:
      if (LOG_LEVEL === LogLevel.FATAL || LOG_LEVEL === LogLevel.ERROR || LOG_LEVEL === LogLevel.WARN || LOG_LEVEL === LogLevel.INFO || LOG_LEVEL === LogLevel.DEBUG || LOG_LEVEL === LogLevel.TRACE) {
        return true;
      }
      break;
    case LogLevel.ERROR:
      if (LOG_LEVEL === LogLevel.ERROR || LOG_LEVEL === LogLevel.WARN || LOG_LEVEL === LogLevel.INFO || LOG_LEVEL === LogLevel.DEBUG || LOG_LEVEL === LogLevel.TRACE) {
        return true;
      }
      break;
    case LogLevel.WARN:
      if (LOG_LEVEL === LogLevel.WARN || LOG_LEVEL === LogLevel.INFO || LOG_LEVEL === LogLevel.DEBUG || LOG_LEVEL === LogLevel.TRACE) {
        return true;
      }
      break;
    case LogLevel.INFO:
      if (LOG_LEVEL === LogLevel.INFO || LOG_LEVEL === LogLevel.DEBUG || LOG_LEVEL === LogLevel.TRACE) {
        return true;
      }
      break;
    case LogLevel.DEBUG:
      if (LOG_LEVEL === LogLevel.DEBUG || LOG_LEVEL === LogLevel.TRACE) {
        return true;
      }
      break;
    case LogLevel.TRACE:
      if (LOG_LEVEL === LogLevel.TRACE) {
        return true;
      }
      break;
  }
  return false;
};

export const printDate = () => {
  const now = new Date();
  return `${now.getDate().padStart(2, '0')}/${(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear().padStart(4, '0')}::${now.toLocaleTimeString()}`;
}

export const logMessage = (logLevel: LogLevel) => (message: any) => {
  if (shouldDisplayLog(logLevel)) {
    console.log(`[MSG] ${printDate()}, ${message}`);
  }
};

export const logInfo = (logLevel: LogLevel) => (content: any, title?: string) => {
  if (shouldDisplayLog(logLevel)) {
    console.log(`[INFO] ${printDate()}` + (title ? `, ${title}:` : ':'));
    console.log(util.inspect(content, { depth: 5, compact: false }));
    console.log(`------`);
  }
};

export const logError = (logLevel: LogLevel) => (content: any, title?: string) => {
  if (shouldDisplayLog(logLevel)) {
    console.log(`[ERROR] ${printDate()}` + (title ? `, ${title}:` : ':'));
    console.log(util.inspect(content, { depth: 5, compact: false }));
    console.log(`_______`);
  }
};

import { LogLevel } from '@bit/juki-team.juki.commons';
import util from 'util';
import { LOG_LEVEL } from '../config';

export const logMessage = (message: any) => {
  if (LOG_LEVEL === LogLevel.TRACE || LOG_LEVEL === LogLevel.DEBUG || LOG_LEVEL === LogLevel.INFO) {
    const now = new Date();
    console.log(`[MSG] ${now}, ${message}`);
  }
};

export const logInfo = (content: any, title?: string) => {
  if (LOG_LEVEL === LogLevel.TRACE || LOG_LEVEL === LogLevel.DEBUG || LOG_LEVEL === LogLevel.INFO) {
    const now = new Date();
    console.log(`[INFO] ${now}` + (title ? `, ${title}:` : ':'));
    console.log(util.inspect(content, { depth: 5, compact: false }));
    console.log(`------`);
  }
};

export const logError = (content: any, title?: string) => {
  if (LOG_LEVEL === LogLevel.TRACE || LOG_LEVEL === LogLevel.DEBUG || LOG_LEVEL === LogLevel.INFO || LOG_LEVEL === LogLevel.WARN || LOG_LEVEL === LogLevel.ERROR) {
    const now = new Date();
    console.log(`[ERROR] ${now}` + (title ? `, ${title}:` : ':'));
    console.log(util.inspect(content, { depth: 5, compact: false }));
    console.log(`_______`);
  }
};
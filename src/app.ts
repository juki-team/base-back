require('dotenv').config();
import {
  jkLogTelegramBot,
  TELEGRAM_JUKI_ERROR_LOGS_CHAT_ID,
  TELEGRAM_JUKI_INFO_LOGS_CHAT_ID,
  TELEGRAM_JUKI_LOGS_BOT_TOKEN,
} from './index';

export const NODE_ENV = process.env.NODE_ENV || 'development';

jkLogTelegramBot.config(TELEGRAM_JUKI_LOGS_BOT_TOKEN, TELEGRAM_JUKI_INFO_LOGS_CHAT_ID, TELEGRAM_JUKI_ERROR_LOGS_CHAT_ID, '__BASE BACK__');

jkLogTelegramBot.sendInfoMessage('Hello', { NODE_ENV });
jkLogTelegramBot.sendInfoMessage('Hello', 'Test Message from base back');

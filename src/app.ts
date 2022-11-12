require('dotenv').config();
import {
  jkLogTelegramBot,
  NODE_ENV,
  TELEGRAM_JUKI_ERROR_LOGS_CHAT_ID,
  TELEGRAM_JUKI_INFO_LOGS_CHAT_ID,
  TELEGRAM_JUKI_LOGS_BOT_TOKEN,
} from './index';

jkLogTelegramBot.config(TELEGRAM_JUKI_LOGS_BOT_TOKEN, TELEGRAM_JUKI_INFO_LOGS_CHAT_ID, TELEGRAM_JUKI_ERROR_LOGS_CHAT_ID, '__BASE BACK__');

jkLogTelegramBot.sendInfoMessage('Hello', { NODE_ENV });
jkLogTelegramBot.sendInfoMessage('Hello', 'Test Message from base back');

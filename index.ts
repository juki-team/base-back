require('dotenv').config();
import { jkLogTelegramBot } from './src/base-back';

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const TELEGRAM_JUKI_LOGS_BOT_TOKEN = process.env.TELEGRAM_JUKI_LOGS_BOT_TOKEN || '';
export const TELEGRAM_JUKI_LOGS_CHAT_ID = process.env.TELEGRAM_JUKI_LOGS_CHAT_ID || '';

jkLogTelegramBot.config(TELEGRAM_JUKI_LOGS_BOT_TOKEN, TELEGRAM_JUKI_LOGS_CHAT_ID, '__BASE BACK__');

jkLogTelegramBot.sendInfoMessage('Hello', { NODE_ENV });
jkLogTelegramBot.sendInfoMessage('Hello', 'Test Message from base back');

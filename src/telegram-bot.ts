export const NODE_ENV = process.env.NODE_ENV || 'development';
export const TELEGRAM_JUKI_LOGS_BOT_TOKEN = process.env.TELEGRAM_JUKI_LOGS_BOT_TOKEN || '';
export const TELEGRAM_JUKI_LOGS_CHAT_ID = process.env.TELEGRAM_JUKI_LOGS_CHAT_ID || '';
import { IncomingMessage } from 'http';
import https from 'https';
import { TelegramBotService } from './base-back';

const fetcher = (url: string) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res: IncomingMessage) => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err: Error) => reject(err));
  });
};

export const telegramBot = new TelegramBotService(
  TELEGRAM_JUKI_LOGS_BOT_TOKEN,
  TELEGRAM_JUKI_LOGS_CHAT_ID,
  '__BASE BACK__',
  fetcher,
);

telegramBot.sendInfoMessage('Runner Service started', { NODE_ENV });

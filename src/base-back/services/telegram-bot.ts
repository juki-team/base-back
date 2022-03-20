import { IncomingMessage } from 'http';
import https from 'https';
import { TelegramBotService } from './';

const fetcher = (url: string) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response: IncomingMessage) => {
      let data = '';
      response.on('data', chunk => {
        data += chunk;
      });
      
      response.on('end', () => {
        resolve(data);
      });
    }).on('error', (err: Error) => reject(err));
  });
};

export const jkLogTelegramBot = new TelegramBotService(fetcher);


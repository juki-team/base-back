import { chunkString } from '@juki-team/commons';
import { AxiosResponse } from 'axios';
import * as util from 'node:util';
import { logError, logInfo, logMessage } from '../../helpers';

export class TelegramBotService {
  _JUKI_LOGS_BOT_TOKEN: string = '';
  _JUKI_INFO_LOGS_CHAT_ID: string = '';
  _JUKI_ERROR_LOGS_CHAT_ID: string = '';
  _HEADER?: string;
  _fetcher: (url: string, options?: any) => Promise<AxiosResponse>;
  readonly maxSizeText = 2000;
  
  constructor(fetcher: (url: string, options?: any) => Promise<any>) {
    // this._JUKI_LOGS_BOT_TOKEN = jukiLogsBotToken;
    // this._JUKI_LOGS_CHAT_ID = jukiLogsChatId;
    // this._HEADER = header;
    this._fetcher = fetcher;
  }
  
  config(jukiLogsBotToken: string, jukiInfoLogsChatId: string, jukiErrorLogsChatId: string, fetcher?: (url: string, options?: any) => Promise<any>) {
    this._JUKI_LOGS_BOT_TOKEN = jukiLogsBotToken;
    this._JUKI_INFO_LOGS_CHAT_ID = jukiInfoLogsChatId;
    this._JUKI_ERROR_LOGS_CHAT_ID = jukiErrorLogsChatId;
    if (fetcher) {
      this._fetcher = fetcher;
    }
  }
  
  setHeader(header: string) {
    this._HEADER = header;
  }
  
  // https://core.telegram.org/bots/api#markdownv2-style
  escape(text: string): string {
    return text
      .split('_').join('\\_')
      .split('*').join('\\*')
      .split('[').join('\\[')
      .split(']').join('\\]')
      .split('(').join('\\(')
      .split(')').join('\\)')
      .split('~').join('\\~')
      .split('`').join('\\`')
      .split('>').join('\\>')
      .split('#').join('\\#')
      .split('+').join('\\+')
      .split('-').join('\\-')
      .split('=').join('\\=')
      .split('|').join('\\|')
      .split('{').join('\\{')
      .split('}').join('\\}')
      .split('.').join('\\.')
      .split('!').join('\\!');
  }
  
  sendMessage(markdownV2Text: string, chatId: string) {
    if (!this._JUKI_LOGS_BOT_TOKEN || !this._JUKI_ERROR_LOGS_CHAT_ID || !this._JUKI_LOGS_BOT_TOKEN || !this._HEADER) {
      return logMessage('PLEASE SET UP THE \'TelegramBotService\'');
    }
    logMessage('Sending Telegram log...');
    const url = `https://api.telegram.org/bot${this._JUKI_LOGS_BOT_TOKEN}/` +
      `sendMessage?chat_id=${chatId}&text=${encodeURIComponent(markdownV2Text)}&parse_mode=MarkdownV2`;
    return this._fetcher(url)
      .then(response => {
        if (response.data.ok) {
          return logMessage('Telegram message sent ' + url);
        }
        throw response;
      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          logError(
            {
              data: error.response.data,
              status: error.response.status,
              headers: error.response.headers,
              chatId,
              markdownV2Text,
            },
            'Error on sending telegram message',
          );
          
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          logError({ request: error.request, chatId, markdownV2Text }, 'Error on sending telegram message');
        } else {
          // Something happened in setting up the request that triggered an Error
          logError({ message: error.message, chatId, markdownV2Text }, 'Error on sending telegram message');
        }
      });
  }
  
  async sendErrorMessage(title: string, error: any, request?: any) {
    logError(error, title);
    const errorText = util.inspect(error, { depth: 5, compact: false });
    const requestText = util.inspect(request, { depth: 5, compact: false });
    
    const message = [
      this._HEADER,
      '*ERROR*',
      this.escape(title),
      '```',
      this.escape(errorText),
      '```',
      '*REQUEST*',
      '```',
      this.escape(requestText),
      '```',
    ].join('\n');
    const messages = chunkString(message, this.maxSizeText);
    const results = [];
    for (let i = 0; i < messages.length; i++) {
      results.push(await this.sendMessage(this.escape(`${i + 1}/${messages.length} [${messages[i].length}/${this.maxSizeText}]\n`) + messages[i], this._JUKI_ERROR_LOGS_CHAT_ID));
    }
    return results;
  }
  
  async sendInfoMessage(title: string, content: any) {
    logInfo(content, title);
    const contentText = util.inspect(content, { depth: 5, compact: false });
    
    const message = [
      this._HEADER,
      '*INFO*',
      this.escape(title),
      '```',
      this.escape(contentText),
      '```',
    ].join('\n');
    
    const messages = chunkString(message, this.maxSizeText);
    const results = [];
    for (let i = 0; i < messages.length; i++) {
      results.push(await this.sendMessage(this.escape(`${i + 1}/${messages.length} [${messages[i].length}/${this.maxSizeText}]\n`) + messages[i], this._JUKI_INFO_LOGS_CHAT_ID));
    }
    
    return results;
  }
}

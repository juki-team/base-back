import { chunkString, LogLevel } from '@juki-team/commons';
import { AxiosResponse } from 'axios';
import * as util from 'node:util';
import { logError, logInfo, logMessage } from '../../helpers';

type fetcherOptionsType = { body?: Object | FormData, method?: 'POST' | 'GET' };

export type fetcherType = (url: string, options?: fetcherOptionsType) => Promise<AxiosResponse>

export class TelegramBotService {
  _JUKI_LOGS_BOT_TOKEN: string = '';
  _JUKI_INFO_LOGS_CHAT_ID: string = '';
  _JUKI_ERROR_LOGS_CHAT_ID: string = '';
  _HEADER?: string;
  _fetcher: fetcherType;
  readonly maxSizeText = 1200;
  
  constructor(fetcher: fetcherType) {
    // this._JUKI_LOGS_BOT_TOKEN = jukiLogsBotToken;
    // this._JUKI_LOGS_CHAT_ID = jukiLogsChatId;
    // this._HEADER = header;
    this._fetcher = fetcher;
  }
  
  config(jukiLogsBotToken: string, jukiInfoLogsChatId: string, jukiErrorLogsChatId: string, fetcher?: fetcherType) {
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
  
  send(partialUrl: string, formData?: FormData) {
    if (!this._JUKI_LOGS_BOT_TOKEN || !this._JUKI_ERROR_LOGS_CHAT_ID || !this._JUKI_LOGS_BOT_TOKEN || !this._HEADER) {
      return logMessage(LogLevel.ERROR)('PLEASE SET UP THE \'TelegramBotService\'');
    }
    
    logMessage(LogLevel.DEBUG)('Sending Telegram log...');
    
    const url = `https://api.telegram.org/bot${this._JUKI_LOGS_BOT_TOKEN}/${partialUrl}`;
    
    return this._fetcher(url, formData ? { body: formData, method: 'POST' } : {})
      .then(response => {
        if (response.data.ok) {
          logMessage(LogLevel.DEBUG)('Telegram message sent ' + url);
          return;
        }
        throw response;
      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          logError(LogLevel.WARN)(
            {
              data: error.response.data,
              status: error.response.status,
              headers: error.response.headers,
              partialUrl,
              url,
            },
            'Error on sending telegram message',
          );
          
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          logError(LogLevel.WARN)(
            { request: error.request, partialUrl, url },
            'Error on sending telegram message',
          );
        } else {
          // Something happened in setting up the request that triggered an Error
          logError(LogLevel.WARN)(
            { message: error.message, partialUrl, url },
            'Error on sending telegram message',
          );
        }
      });
  }
  
  sendErrorDocument(document: any) {
    const formData = new FormData();
    formData.append('chat_id', this._JUKI_ERROR_LOGS_CHAT_ID);
    formData.append('document', document);
    return this.send('sendDocument', formData);
  }
  
  sendMessage(markdownV2Text: string, chatId: string) {
    if (!this._JUKI_LOGS_BOT_TOKEN || !this._JUKI_ERROR_LOGS_CHAT_ID || !this._JUKI_LOGS_BOT_TOKEN || !this._HEADER) {
      return logMessage(LogLevel.ERROR)('PLEASE SET UP THE \'TelegramBotService\'');
    }
    
    logMessage(LogLevel.DEBUG)('Sending Telegram log...');
    return this.send(`sendMessage?chat_id=${chatId}&text=${encodeURIComponent(markdownV2Text)}&parse_mode=MarkdownV2`);
  }
  
  async sendErrorMessage(title: string, error: any, requestData?: any) {
    logError(LogLevel.ERROR)(error, title);
    const errorText = util.inspect(error, { depth: 5, compact: false });
    const requestText = util.inspect(requestData, { depth: 5, compact: false });
    const errorTextChunked = chunkString(errorText, this.maxSizeText);
    
    const messages = errorTextChunked.map(errorText => (
      [
        `_${this.escape(this._HEADER + ':')}_\n*${this.escape(title)}*`,
        '```',
        this.escape(errorText),
        '```',
        '*REQUEST*',
        '```',
        this.escape(requestText),
        '```',
      ].join('\n')
    ));
    
    const results = [];
    for (let i = 0; i < messages.length; i++) {
      results.push(await this.sendMessage(
        messages[i] + (messages.length > 1 ? this.escape(`\n${i
        + 1}/${messages.length} [${messages[i].length}/${this.maxSizeText}]`) : '')
        , this._JUKI_ERROR_LOGS_CHAT_ID));
    }
    
    return results;
  }
  
  async sendInfoMessage(title: string, content: any, text?: boolean) {
    logInfo(LogLevel.DEBUG)(content, title);
    let contentText = util.inspect(content, { depth: 5, compact: false });
    if (text) {
      contentText = '';
      Object.entries(content).forEach(([ key, value ]) => {
        contentText += `\n*${this.escape(key + ':')}* ` +
          `${(Array.isArray(value) ? value : [ value ]).map(v => '`' + this.escape(v + '') + '`').join(', ')}`;
      });
    }
    const contentTextChunked = chunkString(contentText, this.maxSizeText);
    const messages = contentTextChunked.map(contentText => (
      [
        `_${this.escape(this._HEADER + ':')}_\n*${this.escape(title)}*`,
        ...(text ? [ contentText ] : [
          '\n```',
          this.escape(contentText),
          '```',
        ]),
      ].join('\n')
    ));
    
    const results = [];
    for (let i = 0; i < messages.length; i++) {
      results.push(await this.sendMessage(
        messages[i] + (messages.length > 1 ? this.escape(`\n${i
        + 1}/${messages.length} [${messages[i].length}/${this.maxSizeText}]`) : '')
        , this._JUKI_INFO_LOGS_CHAT_ID));
    }
    
    return results;
  }
}

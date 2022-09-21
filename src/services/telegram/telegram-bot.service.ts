import { AxiosResponse } from 'axios';
import * as util from 'node:util';
import { logError, logInfo, logMessage } from '../../helpers/log';

export class TelegramBotService {
  _JUKI_LOGS_BOT_TOKEN?: string;
  _JUKI_LOGS_CHAT_ID?: string;
  _HEADER?: string;
  _fetcher: (url: string, options?: any) => Promise<AxiosResponse>;
  readonly maxSizeText = 2000;
  
  constructor(fetcher: (url: string, options?: any) => Promise<any>) {
    // this._JUKI_LOGS_BOT_TOKEN = jukiLogsBotToken;
    // this._JUKI_LOGS_CHAT_ID = jukiLogsChatId;
    // this._HEADER = header;
    this._fetcher = fetcher;
  }
  
  config(jukiLogsBotToken: string, jukiLogsChatId: string, header: string, fetcher?: (url: string, options?: any) => Promise<any>) {
    this._JUKI_LOGS_BOT_TOKEN = jukiLogsBotToken;
    this._JUKI_LOGS_CHAT_ID = jukiLogsChatId;
    this._HEADER = header;
    if (fetcher) {
      this._fetcher = fetcher;
    }
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
  
  sendMessage(markdownV2Text: string) {
    if (!this._JUKI_LOGS_BOT_TOKEN || !this._JUKI_LOGS_BOT_TOKEN || !this._HEADER) {
      return logMessage('PLEASE SET UP THE \'TelegramBotService\'');
    }
    logMessage('Sending Telegram log...');
    return this._fetcher(
      `https://api.telegram.org/bot${this._JUKI_LOGS_BOT_TOKEN}/` +
      `sendMessage?chat_id=${this._JUKI_LOGS_CHAT_ID}&text=${encodeURIComponent(markdownV2Text)}&parse_mode=MarkdownV2`,
    )
      .then(response => {
        if (response.data.ok) {
          return logInfo(response.data, 'Telegram message sent');
        }
        throw response;
      })
      .catch(error => logError(error, 'Error on sending telegram message'));
  }
  
  sendErrorMessage(title: string, error: any, request?: any) {
    logError(error, title);
    const errorText = util.inspect(error, { depth: 5, compact: false }).substring(0, this.maxSizeText);
    const requestText = util.inspect(request, { depth: 5, compact: false }).substring(0, this.maxSizeText);
    
    const message = [
      this._HEADER,
      '*ERROR*',
      this.escape(title),
      '```',
      this.escape(errorText.length === this.maxSizeText ? errorText + '\n...message to large...' : errorText),
      '```',
      '*REQUEST*',
      '```',
      this.escape(requestText.length === this.maxSizeText ? requestText + '\n...message to large...' : requestText),
      '```',
    ].join('\n');
    return this.sendMessage(message);
  }
  
  sendInfoMessage(title: string, content: any) {
    logInfo(content, title);
    const contentText = util.inspect(content, { depth: 5, compact: false }).substring(0, this.maxSizeText);
    
    const message = [
      this._HEADER,
      '*INFO*',
      this.escape(title),
      '```',
      this.escape(contentText.length === this.maxSizeText ? contentText + '\n...message to large...' : contentText),
      '```',
    ].join('\n');
    return this.sendMessage(message);
  }
}
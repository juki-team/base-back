import { chunkString, LogLevel } from '@juki-team/commons';
import { log, stringifyObject } from '../../helpers';

type fetcherOptionsType = { body?: string | FormData, method?: 'POST' | 'GET' };

export type fetcherType = (url: string, options?: fetcherOptionsType) => Promise<Response>

export class TelegramBotService {
  _JUKI_LOGS_BOT_TOKEN: string = '';
  _JUKI_INFO_LOGS_CHAT_ID: string = '';
  _JUKI_ERROR_LOGS_CHAT_ID: string = '';
  _HEADER?: string;
  _fetcher: fetcherType;
  // The maximum length of a Telegram message is 4096 characters and it must be UTF-8 encoded.
  readonly maxSizeText = 2048;
  
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
    if (typeof text !== 'string') {
      return '__NO_STRING__';
    }
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
      return log(LogLevel.ERROR)('PLEASE SET UP THE \'TelegramBotService\'');
    }
    
    log(LogLevel.TRACE)('sending Telegram log');
    
    const url = `https://api.telegram.org/bot${this._JUKI_LOGS_BOT_TOKEN}/${partialUrl}`;
    
    return this._fetcher(url, formData ? { body: formData, method: 'POST' } : {})
      .then(response => response.json())
      .then(response => {
        if (response.ok) {
          log(LogLevel.TRACE)('telegram message sent ' + url);
          return;
        }
        throw response;
      })
      .catch(error => {
        if (error.response) {
          log(LogLevel.WARN)(
            'error on sending telegram message',
            {
              data: error.response.data,
              status: error.response.status,
              headers: error.response.headers,
              partialUrl,
              url,
              possibleError: 'The request was made and the server responded with a status code, that falls out of the range of 2xx',
            },
          );
          
        } else if (error.request) {
          log(LogLevel.WARN)(
            'error on sending telegram message',
            {
              request: error.request,
              partialUrl, url,
              possibleError: 'The request was made but no response was received `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js',
            },
          );
        } else {
          log(LogLevel.WARN)(
            'error on sending telegram message',
            {
              message: error?.message,
              partialUrl, url,
              possibleError: 'Something happened in setting up the request that triggered an Error',
            },
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
    return this.send(`sendMessage?chat_id=${chatId}&text=${encodeURIComponent(markdownV2Text)}&parse_mode=MarkdownV2`);
  }
  
  getTitle(title: string) {
    return `${this.escape(this._HEADER + ':')} *${this.escape(title)}*`;
  }
  
  async sendMessages(messages: string[], chatId: string) {
    const results = [];
    for (let i = 0; i < messages.length; i++) {
      results.push(await this.sendMessage(
        messages[i]
        + (messages.length > 1
          ? this.escape(`\n${i + 1}/${messages.length} [${messages[i].length}/${this.maxSizeText}]`)
          : '')
        , chatId,
      ));
    }
    return results;
  }
  
  async sendErrorMessage(title: string, error: any, requestData?: any) {
    log(LogLevel.INFO)(`ERROR: sending error message "${title}"`, error);
    const errorText = stringifyObject(error, 5);
    const requestText = stringifyObject(requestData, 5);
    const errorTextChunked = chunkString(errorText, this.maxSizeText);
    
    const messages = errorTextChunked.map(errorText => (
      [
        this.getTitle(title),
        '```',
        this.escape(errorText),
        '```',
        ...(requestData !== undefined
          ? [
            '*REQUEST*',
            '```',
            this.escape(requestText),
            '```',
          ]
          : []),
      ].join('\n')
    ));
    
    return await this.sendMessages(messages, this._JUKI_ERROR_LOGS_CHAT_ID);
  }
  
  toText(content: any) {
    let contentText = '';
    
    if (typeof content === 'object' && content !== null) {
      Object.entries(content).forEach(([ key, value ]) => {
        contentText += `\n*${this.escape(key + ':')}* `
          + `${(Array.isArray(value) ? value : [ value ]).map(v => '`' + this.escape(v instanceof RegExp ? v.toString() : JSON.stringify(v)) + '`').join(', ')}`;
      });
    } else {
      contentText = `${content}`;
    }
    
    return contentText;
  }
  
  async sendInfoMessage(title: string, content: any, text?: boolean) {
    log(LogLevel.INFO)(`INFO: sending info message "${title}"`, content);
    let contentText = stringifyObject(content, 5);
    if (text) {
      contentText = this.toText(content);
    }
    const contentTextChunked = chunkString(contentText, this.maxSizeText);
    const messages = contentTextChunked.map(contentText => (
      [
        this.getTitle(title),
        ...(text
            ? [ contentText ]
            : [ '\n```', this.escape(contentText), '```' ]
        ),
      ].join('\n')
    ));
    
    return await this.sendMessages(messages, this._JUKI_INFO_LOGS_CHAT_ID);
  }
}

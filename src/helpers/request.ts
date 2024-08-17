import { HTTPMethod, LogLevel } from '@juki-team/commons';
import { IncomingMessage } from 'http';
import https from 'https';
import { logInfo, logMessage } from './log';

const axios = require('axios');

export const fetcherHttps_deprecated = ({
                                          hostname = '',
                                          path = '/',
                                          method = HTTPMethod.GET,
                                          uri = '',
                                          body = {},
                                        }: {
  hostname?: string,
  path?: string,
  method?: HTTPMethod,
  uri?: string,
  body?: Object
}) => new Promise((resolve, reject) => {
  if (method === HTTPMethod.POST) {
    const postData = JSON.stringify(body);
    const options = {
      hostname,
      port: 443,
      path,
      method: HTTPMethod.POST,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
      },
      timeout: 900000,
    };
    logInfo(LogLevel.TRACE)({ options, postData }, 'fetcherHttps POST');
    const req = https.request(options, (response) => {
      logMessage(LogLevel.TRACE)('statusCode: ' + response.statusCode);
      logMessage(LogLevel.TRACE)('headers:' + response.headers);
      response.on('data', (d) => process.stdout.write(d));
      const data: Uint8Array[] = [];
      response.on('data', (chunk) => data.push(chunk));
      response.on('end', () => resolve(Buffer.concat(data).toString()));
    }).on('error', (e) => reject(e));
    req.write(postData);
    req.end();
    
  } else if (method === HTTPMethod.GET) {
    const url = uri || hostname + path;
    https.get(url, (response: IncomingMessage) => {
      logMessage(LogLevel.TRACE)('statusCode: ' + response.statusCode);
      logMessage(LogLevel.TRACE)('headers:' + response.headers);
      const data: Uint8Array[] = [];
      response.on('data', chunk => data.push(chunk));
      response.on('end', () => resolve(Buffer.concat(data).toString()));
    }).on('error', (err: Error) => reject(err));
  }
});

export const fetcherAxios = async ({
                                     method = 'GET',
                                     url,
                                     body = {},
                                     config,
                                   }: {
  method?: string,
  url: string,
  body?: Object,
  config?: { timeout: number }
}) => {
  if (method === 'POST') {
    logInfo(LogLevel.TRACE)({ url, method, body }, 'fetcherAxios POST');
    const headers: any = {};
    if (body instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data';
    }
    return await axios.post(url, body, { ...config, headers });
  } else if (method === 'GET') {
    logInfo(LogLevel.TRACE)({ url, method }, 'fetcherAxios GET');
    return await axios.get(url, config);
  }
  return await axios.get(url, config);
};

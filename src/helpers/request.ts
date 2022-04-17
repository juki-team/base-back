import axios from 'axios';
import { IncomingMessage } from 'http';
import https from 'https';
import { logInfo, logMessage } from './log';

export const fetcherHttps = ({
  hostname = '',
  path = '/',
  method = 'GET',
  uri = '',
  body = {},
}: { hostname?: string, path?: string, method?: string, uri?: string, body?: Object }) => new Promise((resolve, reject) => {
  if (method === 'POST') {
    const postData = JSON.stringify(body);
    const options = {
      hostname,
      port: 443,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
      },
      timeout: 900000,
    };
    logInfo({ options, postData }, 'fetcherHttps POST');
    const req = https.request(options, (response) => {
      logMessage('statusCode: ' + response.statusCode);
      logMessage('headers:' + response.headers);
      response.on('data', (d) => process.stdout.write(d));
      const data: Uint8Array[] = [];
      response.on('data', (chunk) => data.push(chunk));
      response.on('end', () => resolve(Buffer.concat(data).toString()));
    }).on('error', (e) => reject(e));
    req.write(postData);
    req.end();
    
  } else if (method === 'GET') {
    const url = uri || hostname + path;
    https.get(url, (response: IncomingMessage) => {
      logMessage('statusCode: ' + response.statusCode);
      logMessage('headers:' + response.headers);
      const data: Uint8Array[] = [];
      response.on('data', chunk => data.push(chunk));
      response.on('end', () => resolve(Buffer.concat(data).toString()));
    }).on('error', (err: Error) => reject(err));
  }
});

export const fetcherAxios = async ({ method = 'GET', url, body = {} }: { method?: string, url: string, body?: Object }) => {
  if (method === 'POST') {
    logInfo({ url, method, body }, 'fetcherAxios POST');
    return await axios.post(url, body, { timeout: 900000 });
  } else if (method === 'GET') {
    logInfo({ url, method }, 'fetcherAxios GET');
    return await axios.get(url, { timeout: 900000 });
  }
};

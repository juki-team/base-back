import { IncomingMessage } from 'http';
import https from 'https';
import { logMessage } from './log';

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
    
    const req = https.request(options, (res) => {
      logMessage('statusCode: ' + res.statusCode);
      logMessage('headers:' + res.headers);
      res.on('data', (d) => process.stdout.write(d));
      const data: Uint8Array[] = [];
      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data).toString()));
    }).on('error', (e) => reject(e));
    req.write(postData);
    req.end();
    
  } else if (method === 'GET') {
    const url = uri || hostname + path;
    https.get(url, (response: IncomingMessage) => {
      const data: Uint8Array[] = [];
      response.on('data', chunk => data.push(chunk));
      response.on('end', () => resolve(Buffer.concat(data).toString()));
    }).on('error', (err: Error) => reject(err));
  }
});

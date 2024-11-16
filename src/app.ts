import { jkLogTelegramBot, NODE_ENV } from './index';

jkLogTelegramBot.setHeader('__BASE BACK__');

void jkLogTelegramBot.sendInfoMessage('Hello', { NODE_ENV });
void jkLogTelegramBot.sendInfoMessage('Hello', 'Test Message from base back');

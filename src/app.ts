require('dotenv').config();
import { jkLogTelegramBot, NODE_ENV } from './index';

jkLogTelegramBot.setHeader('__BASE BACK__');

jkLogTelegramBot.sendInfoMessage('Hello', { NODE_ENV });
jkLogTelegramBot.sendInfoMessage('Hello', 'Test Message from base back');

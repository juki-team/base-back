require('dotenv').config({ path: '.env.local' });

import { telegramBot } from './src/telegram-bot';

telegramBot.sendInfoMessage('Hello', 'Test Message');

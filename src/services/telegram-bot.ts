import { fetcherHttps } from '../helpers/request';
import { TelegramBotService } from './telegram-bot.service';

const getFetcher = (uri: string) => fetcherHttps({ uri, method: 'GET' });

export const jkLogTelegramBot = new TelegramBotService(getFetcher);

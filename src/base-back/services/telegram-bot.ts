import { fetcherHttps } from '../helpers';
import { TelegramBotService } from './';

const getFetcher = (uri: string) => fetcherHttps({ uri, method: 'GET' });

export const jkLogTelegramBot = new TelegramBotService(getFetcher);

import { fetcherAxios } from '../helpers';
import { TelegramBotService } from './telegram-bot.service';

const getFetcher = (url: string) => fetcherAxios({ url });

export const jkLogTelegramBot = new TelegramBotService(getFetcher);

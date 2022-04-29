import { fetcherAxios } from '../helpers/request';
import { TelegramBotService } from './telegram-bot.service';

const getFetcher = (url: string) => fetcherAxios({ url });

export const jkLogTelegramBot = new TelegramBotService(getFetcher);

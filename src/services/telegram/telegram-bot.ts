import { TELEGRAM_JUKI_ERROR_LOGS_CHAT_ID, TELEGRAM_JUKI_INFO_LOGS_CHAT_ID, TELEGRAM_JUKI_LOGS_BOT_TOKEN } from '../../config';
import { fetcherAxios } from '../../helpers/request';
import { TelegramBotService } from './telegram-bot.service';

const getFetcher = (url: string) => fetcherAxios({ url });

export const jkLogTelegramBot = new TelegramBotService(getFetcher);

jkLogTelegramBot.config(TELEGRAM_JUKI_LOGS_BOT_TOKEN, TELEGRAM_JUKI_INFO_LOGS_CHAT_ID, TELEGRAM_JUKI_ERROR_LOGS_CHAT_ID);

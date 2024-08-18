import {
  TELEGRAM_JUKI_ERROR_LOGS_CHAT_ID,
  TELEGRAM_JUKI_INFO_LOGS_CHAT_ID,
  TELEGRAM_JUKI_LOGS_BOT_TOKEN,
} from '../../config';
import { fetcherNodeFetch } from '../../helpers/request';
import { fetcherType, TelegramBotService } from './telegram-bot.service';

const getFetcher: fetcherType = (url: string, options) => fetcherNodeFetch(
  { url, body: options?.body, method: options?.method });

export const jkLogTelegramBot = new TelegramBotService(getFetcher);

jkLogTelegramBot.config(
  TELEGRAM_JUKI_LOGS_BOT_TOKEN,
  TELEGRAM_JUKI_INFO_LOGS_CHAT_ID,
  TELEGRAM_JUKI_ERROR_LOGS_CHAT_ID,
);

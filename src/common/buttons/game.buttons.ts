import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { Language } from '../types';
import { ACCEPT_CHALLENGE_ACTION, DENY_CHALLENGE_ACTION } from '../constants';
import { LOCALE } from '../locale';

export const acceptButton = (language: Language) => {
   const button: InlineKeyboardButton = {
      text: `✅ ${LOCALE[language].buttonAccept}`,
      callback_data: ACCEPT_CHALLENGE_ACTION
   };
   return button;
};

export const denyButton = (language: Language) => {
   const button: InlineKeyboardButton = {
      text: `❌ ${LOCALE[language].buttonDeny}`,
      callback_data: DENY_CHALLENGE_ACTION
   };
   return button;
};

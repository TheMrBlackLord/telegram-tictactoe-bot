import { TelegrafContext } from '../context';
import { LOCALE } from '../locale';
import { LocaleLanguage, Stats } from '../types';

export const helloString = ({
   session: { language },
   from,
   botInfo
}: TelegrafContext) => {
   return `👋 ${LOCALE[language].hello[0]} ${from.first_name ?? ''}, ${
      LOCALE[language].hello[1]
   } ${botInfo.first_name}`;
};

export const statsString = (locale: LocaleLanguage, stats: Stats) => {
   return `🎲 ${locale.totalGamesCount}: ${stats.totalGamesCount}\n🎖 ${
      locale.winPercentage
   }: ${stats.winPercentage + '%'}\n\n🏆 ${locale.wins}: ${stats.wins}\n❌ ${
      locale.defeats
   }: ${stats.defeats}\n⚖️ ${locale.draws}: ${stats.draws}`;
};

export const changeLangSuccessString = (locale: LocaleLanguage) => {
   return `${locale.changeLanguageSuccess} ${locale.language}`;
};

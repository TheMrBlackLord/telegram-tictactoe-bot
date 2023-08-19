import { Telegraf } from 'telegraf';

export interface IBot {
   bot: Telegraf;
   init(): void;
}

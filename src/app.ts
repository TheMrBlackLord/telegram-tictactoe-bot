import { IBot } from './interfaces';
import { IOC } from './ioc';
import { TYPES } from './ioc/types';

const bot = IOC.get<IBot>(TYPES.Bot);

bot.init();

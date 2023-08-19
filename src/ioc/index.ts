import { Container } from 'inversify';
import { IBot, IConfigService } from '../interfaces';
import { ConfigService } from '../services/config.service';
import { TYPES } from './types';
import { Bot } from '../bot';

const IOC = new Container();
IOC.bind<IConfigService>(TYPES.ConfigService).to(ConfigService);
IOC.bind<IBot>(TYPES.Bot).to(Bot);

export { IOC };

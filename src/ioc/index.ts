import { Container } from 'inversify';
import { IConfigService } from '../interfaces';
import { ConfigService } from '../services/config.service';
import { TYPES } from './types';

const IOC = new Container();
IOC.bind<IConfigService>(TYPES.ConfigService).to(ConfigService);

export { IOC };

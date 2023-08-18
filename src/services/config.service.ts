import { DotenvParseOutput, config } from 'dotenv';
import { IConfigService } from '../interfaces';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { ERRORS } from '../errors';

@injectable()
export class ConfigService implements IConfigService {
   private envConfig: DotenvParseOutput;
   constructor() {
      const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
      const { parsed, error } = config({
         path: `.${mode}.env`
      });
      if (error) {
         throw error;
      }
      if (!parsed) {
         throw new Error(ERRORS.NO_PARSED);
      }
      this.envConfig = parsed;
   }

   getOrThrow<T = string>(property: string): T {
      const value = this.envConfig[property];
      if (!value) {
         throw new Error(ERRORS.NO_PROPERTY);
      }
      return value as T;
   }
}

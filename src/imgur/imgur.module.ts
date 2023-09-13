import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ImgurModuleAsyncOptions } from '../common/types';
import { IMGUR_CLIENT } from '../common/constants';
import ImgurClient from 'imgur';
import { ImgurService } from './imgur.service';

@Module({
   providers: [ImgurService],
   exports: [ImgurService]
})
export class ImgurModule {
   static forRootAsync(options: ImgurModuleAsyncOptions): DynamicModule {
      return {
         module: ImgurModule,
         global: options.isGlobal,
         imports: options.imports,
         providers: [this.createServiceProvider(options)]
      };
   }

   private static createServiceProvider(options: ImgurModuleAsyncOptions): Provider {
      return {
         provide: IMGUR_CLIENT,
         async useFactory(...args: any[]) {
            const { clientId, clientSecret } = await options.useFactory(...args);

            const imgur = new ImgurClient({
               clientId,
               clientSecret
            });

            return imgur;
         },
         inject: options.inject
      };
   }
}

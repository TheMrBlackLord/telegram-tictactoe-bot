import { ModuleMetadata } from '@nestjs/common/interfaces';

export type ImgurModuleOptions = {
   clientId: string;
   clientSecret: string;
};
export type ImgurModuleAsyncOptions = {
   isGlobal: boolean;
   useFactory?: (...args: any[]) => Promise<ImgurModuleOptions> | ImgurModuleOptions;
   inject?: any[];
} & Pick<ModuleMetadata, 'imports'>;

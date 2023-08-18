export interface IConfigService {
   getOrThrow<T = string>(property: string): Exclude<T, 'undefined'>;
}

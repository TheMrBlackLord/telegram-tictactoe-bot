import { Inject, Injectable } from '@nestjs/common';
import { IMGUR_CLIENT } from '../common/constants';
import ImgurClient from 'imgur';

@Injectable()
export class ImgurService {
   constructor(@Inject(IMGUR_CLIENT) private readonly imgurClient: ImgurClient) {}

   async upload(image: ReadableStream | Buffer) {
      try {
         const response = await this.imgurClient.upload({ image });
         return response.data.link;
      } catch (_) {
         return null;
      }
   }
}

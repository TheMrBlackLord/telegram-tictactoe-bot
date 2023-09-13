import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Image } from '../schemas/image.schema';
import { Model } from 'mongoose';

@Injectable()
export class ImageService {
   constructor(@InjectModel(Image.name) private imageModel: Model<Image>) {}

   async create(fileID: string, shorthand: string) {
      return await this.imageModel.create({
         fileID,
         shorthand
      });
   }

   async findByShorthand(shorthand: string) {
      return this.imageModel.findOne({ shorthand });
   }
}

import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.scema';

@Global()
@Module({
   imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
   providers: [UserService],
   exports: [UserService]
})
export class UserModule {}

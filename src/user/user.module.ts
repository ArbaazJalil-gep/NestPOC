import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongoDbModule } from 'src/mongo-db/mongo-db.module';

@Module({
  imports: [MongoDbModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
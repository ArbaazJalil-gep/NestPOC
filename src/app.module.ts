import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoDbModule } from './mongo-db/mongo-db.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [MongoDbModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

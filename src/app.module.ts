import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoDbModule } from './mongo-db/mongo-db.module';
import { QueryBuilderModule } from './user/QueryBuilder.module';

@Module({
  imports: [MongoDbModule, QueryBuilderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

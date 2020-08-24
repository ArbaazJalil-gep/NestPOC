import { Module } from '@nestjs/common';
import { QueryBuilderController } from './QueryBuilder.controller';
import { QueryBuilderService } from './QueryBuilderService';
import { MongoDbModule } from 'src/mongo-db/mongo-db.module';

@Module({
  imports: [MongoDbModule],
  controllers: [QueryBuilderController],
  providers: [QueryBuilderService]
})
export class QueryBuilderModule {}
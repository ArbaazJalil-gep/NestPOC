import { Module } from '@nestjs/common';
import { QueryBuilderController } from './QueryBuilder.controller';
import { QueryBuilderService } from './QueryBuilderService';
import { MongoDbModule } from 'src/mongo-db/mongo-db.module';
import { UpdateBuilderService } from './update-builder/update-builder.service';

@Module({
  imports: [MongoDbModule],
  controllers: [QueryBuilderController],
  providers: [QueryBuilderService, UpdateBuilderService]
})
export class QueryBuilderModule {}
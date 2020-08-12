import { Module } from '@nestjs/common';
// import { MongoDbController } from './mongo-db.controller';
// import { MongoDbService } from './mongo-db.service';

 
import { mongoDbProviders } from './mongodb.provider';

@Module({
  providers: [...mongoDbProviders],
  exports: [...mongoDbProviders],
})
export class MongoDbModule {

}
import { Controller, Get } from '@nestjs/common';
// import { MongoDbService } from './mongo-db.service';

@Controller('mongo-db')
export class MongoDbController {
    constructor() {}

    @Get()
    getDb(): string {
      //return this.mongoDbService.getDb();
      return 'gg';
    }
}

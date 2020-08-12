import { Test, TestingModule } from '@nestjs/testing';
import { MongoDbController } from './mongo-db.controller';

describe('MongoDb Controller', () => {
  let controller: MongoDbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MongoDbController],
    }).compile();

    controller = module.get<MongoDbController>(MongoDbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

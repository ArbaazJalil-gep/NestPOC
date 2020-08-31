import { Test, TestingModule } from '@nestjs/testing';
import { UpdateBuilderService } from './update-builder.service';

describe('UpdateBuilderService', () => {
  let service: UpdateBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateBuilderService],
    }).compile();

    service = module.get<UpdateBuilderService>(UpdateBuilderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

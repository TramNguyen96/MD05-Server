import { Test, TestingModule } from '@nestjs/testing';
import { ProductOptionsService } from './product-options.service';

describe('ProductOptionsService', () => {
  let service: ProductOptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductOptionsService],
    }).compile();

    service = module.get<ProductOptionsService>(ProductOptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

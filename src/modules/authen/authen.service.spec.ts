import { Test, TestingModule } from '@nestjs/testing';
import { AuthenService } from './authen.service';

describe('AuthenService', () => {
  let service: AuthenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthenService],
    }).compile();

    service = module.get<AuthenService>(AuthenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

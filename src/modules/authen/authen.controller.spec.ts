import { Test, TestingModule } from '@nestjs/testing';
import { AuthenController } from './authen.controller';
import { AuthenService } from './authen.service';

describe('AuthenController', () => {
  let controller: AuthenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenController],
      providers: [AuthenService],
    }).compile();

    controller = module.get<AuthenController>(AuthenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

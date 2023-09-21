import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  /* Version Api */
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ["1"]
  });

    /* Validation */
  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
  }),
  );
  
  await app.listen(3000, ()=>{
    console.log(`Server on port: ${`http://localhost:3000/`}`);
    
  });
}
bootstrap();

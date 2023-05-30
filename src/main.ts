import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SetupGraphql } from './common/utils/setupGraphql';
import { SetupInterceptor } from './common/utils/setupInterceptor';
import { SetupPipe } from './common/utils/setupPipe';

async function server() {
  const port = process.env.PORT || 3010;
  const app = await NestFactory.create(AppModule);

  SetupInterceptor.for(app);

  SetupPipe.for(app);

  SetupGraphql.for(app);

  await app.listen(port);
}
server();

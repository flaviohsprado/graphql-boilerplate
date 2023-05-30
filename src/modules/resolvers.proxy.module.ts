import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AuthResolver } from './auth/auth.resolver';
import { UserModule } from './user/user.module';
import { UserResolver } from './user/user.resolver';

@Module({
  imports: [UserModule.register(), AuthModule.register()],
  providers: [UserResolver, AuthResolver],
  exports: [UserModule.register(), AuthModule.register()],
})
export class ResolversModule {}

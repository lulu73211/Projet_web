import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule]
})
export class UserModule {}

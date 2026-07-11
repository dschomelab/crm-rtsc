import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma/prisma.module';
import { AccessProfilesService } from './access-profiles.service';
import { AccessProfilesController } from './access-profiles.controller';

@Module({
  imports: [PrismaModule],
  providers: [AccessProfilesService],
  controllers: [AccessProfilesController],
  exports: [AccessProfilesService],
})
export class AccessProfilesModule {}

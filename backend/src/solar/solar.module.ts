import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma/prisma.module';
import { SolarService } from './solar.service';
import { SolarController } from './solar.controller';

@Module({
  imports: [PrismaModule],
  providers: [SolarService],
  controllers: [SolarController],
  exports: [SolarService],
})
export class SolarModule {}

import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma/prisma.module';
import { EquipmentsService } from './equipments.service';
import { EquipmentsController } from './equipments.controller';

@Module({
  imports: [PrismaModule],
  providers: [EquipmentsService],
  controllers: [EquipmentsController],
  exports: [EquipmentsService],
})
export class EquipmentsModule {}

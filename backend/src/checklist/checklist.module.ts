import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma/prisma.module';
import { ChecklistService } from './checklist.service';
import { ChecklistController } from './checklist.controller';

@Module({
  imports: [PrismaModule],
  providers: [ChecklistService],
  controllers: [ChecklistController],
  exports: [ChecklistService],
})
export class ChecklistModule {}

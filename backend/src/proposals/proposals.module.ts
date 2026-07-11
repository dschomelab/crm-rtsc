import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma/prisma.module';
import { ProposalsService } from './proposals.service';
import { ProposalsController } from './proposals.controller';

@Module({
  imports: [PrismaModule],
  providers: [ProposalsService],
  controllers: [ProposalsController],
  exports: [ProposalsService],
})
export class ProposalsModule {}

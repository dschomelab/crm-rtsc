import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma/prisma.module';
import { CostsService } from './costs.service';
import { CostsController } from './costs.controller';

@Module({
  imports: [PrismaModule],
  providers: [CostsService],
  controllers: [CostsController],
  exports: [CostsService],
})
export class CostsModule {}

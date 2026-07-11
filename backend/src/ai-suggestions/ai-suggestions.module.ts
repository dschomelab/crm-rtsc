import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma/prisma.module';
import { AiSuggestionsService } from './ai-suggestions.service';
import { AiSuggestionsController } from './ai-suggestions.controller';

@Module({
  imports: [PrismaModule],
  providers: [AiSuggestionsService],
  controllers: [AiSuggestionsController],
  exports: [AiSuggestionsService],
})
export class AiSuggestionsModule {}

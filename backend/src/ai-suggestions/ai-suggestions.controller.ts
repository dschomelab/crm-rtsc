import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AiSuggestionsService } from './ai-suggestions.service';
import { CreateAiSuggestionDto } from './dto/create-ai-suggestion.dto';

@ApiTags('AI Suggestions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai-suggestions')
export class AiSuggestionsController {
  constructor(private readonly service: AiSuggestionsService) {}

  @Get()
  async findAll(
    @Query('userId') userId?: string,
    @Query('type') type?: string,
  ) {
    return this.service.findAll({ userId, type });
  }

  @Post()
  async create(@Body() dto: CreateAiSuggestionDto, @CurrentUser('id') userId: string) {
    return this.service.create(dto, userId);
  }

  @Post(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.service.markAsRead(id);
  }
}

import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CommunicationsService } from './communications.service';
import { CreateCommunicationDto } from './dto/create-communication.dto';

@ApiTags('Communications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('communications')
export class CommunicationsController {
  constructor(private readonly service: CommunicationsService) {}

  @Get()
  async findAll(
    @Query('leadId') leadId?: string,
    @Query('customerId') customerId?: string,
    @Query('type') type?: string,
  ) {
    return this.service.findAll({ leadId, customerId, type });
  }

  @Post()
  async create(@Body() dto: CreateCommunicationDto, @CurrentUser('id') userId: string) {
    return this.service.create(dto, userId);
  }
}

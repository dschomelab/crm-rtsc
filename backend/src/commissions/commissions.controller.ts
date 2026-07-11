import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CommissionsService } from './commissions.service';
import { CreateCommissionDto } from './dto/create-commission.dto';

@ApiTags('Commissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('commissions')
export class CommissionsController {
  constructor(private readonly service: CommissionsService) {}

  @Get()
  async findAll(@Query('userId') userId?: string) {
    return this.service.findAll({ userId });
  }

  @Post()
  async create(@Body() dto: CreateCommissionDto) {
    return this.service.create(dto);
  }

  @Post(':id/pay')
  async pay(@Param('id') id: string) {
    return this.service.pay(id);
  }
}

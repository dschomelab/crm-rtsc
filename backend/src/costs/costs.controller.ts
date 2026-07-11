import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CostsService } from './costs.service';
import { CreateCostDto, UpdateCostDto } from './dto/create-cost.dto';

@ApiTags('Costs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('costs')
export class CostsController {
  constructor(private readonly costsService: CostsService) {}

  @Get()
  findAll(@Query('proposalId') proposalId?: string) {
    return this.costsService.findAll(proposalId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.costsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateCostDto) {
    return this.costsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCostDto) {
    return this.costsService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.costsService.delete(id);
  }
}

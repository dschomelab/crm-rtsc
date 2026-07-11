import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { MoveLeadDto } from './dto/move-lead.dto';
import { QueryLeadDto } from './dto/query-lead.dto';

@ApiTags('Leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  async findAll(@Query() query: QueryLeadDto) {
    return this.leadsService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.leadsService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateLeadDto, @CurrentUser('id') userId: string) {
    return this.leadsService.create(dto, userId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateLeadDto) {
    return this.leadsService.update(id, dto);
  }

  @Patch(':id/move')
  async moveToStage(
    @Param('id') id: string,
    @Body() dto: MoveLeadDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.leadsService.moveToStage(id, dto.stageId, userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.leadsService.delete(id);
  }

  @Post(':id/tags')
  async addTag(@Param('id') id: string, @Body('tagId') tagId: string) {
    return this.leadsService.addTag(id, tagId);
  }

  @Delete(':id/tags/:tagId')
  async removeTag(@Param('id') id: string, @Param('tagId') tagId: string) {
    return this.leadsService.removeTag(id, tagId);
  }
}

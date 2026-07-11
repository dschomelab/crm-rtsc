import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TeamsService } from './teams.service';
import { CreateTeamDto, UpdateTeamDto } from './dto/create-team.dto';

@ApiTags('Teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  findAll(@Query('companyId') companyId?: string) {
    return this.teamsService.findAll(companyId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.teamsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateTeamDto) {
    return this.teamsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTeamDto) {
    return this.teamsService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.teamsService.delete(id);
  }
}

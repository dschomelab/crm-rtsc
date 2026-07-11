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
import { ProposalsService } from './proposals.service';
import {
  CreateProposalDto,
  UpdateProposalDto,
  ApproveProposalDto,
} from './dto/create-proposal.dto';

@ApiTags('Proposals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.proposalsService.findAll({
      search,
      status,
      customerId,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.proposalsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateProposalDto, @CurrentUser('id') userId: string) {
    return this.proposalsService.create(dto, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProposalDto) {
    return this.proposalsService.update(id, dto);
  }

  @Patch(':id/send')
  send(@Param('id') id: string) {
    return this.proposalsService.send(id);
  }

  @Patch(':id/approve')
  approve(
    @Param('id') id: string,
    @Body() dto: ApproveProposalDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.proposalsService.approve(id, dto, userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.proposalsService.delete(id);
  }
}

import { IsOptional, IsString, IsNumber, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryLeadDto {
  @ApiPropertyOptional() @IsOptional() @IsString() pipelineId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() stageId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assignedTo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) minValue?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) maxValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() dateFrom?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dateTo?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(1) page?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(1) limit?: number;
  @ApiPropertyOptional({ enum: ['name', 'email', 'phone', 'source', 'status', 'value', 'createdAt'] })
  @IsOptional() @IsString() @IsIn(['name', 'email', 'phone', 'source', 'status', 'value', 'createdAt']) sortBy?: string;
  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional() @IsString() @IsIn(['asc', 'desc']) sortOrder?: string;
}

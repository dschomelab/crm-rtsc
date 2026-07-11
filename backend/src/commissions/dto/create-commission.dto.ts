import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommissionDto {
  @ApiProperty() @IsString() @IsNotEmpty() proposalId: string;
  @ApiProperty() @IsString() @IsNotEmpty() userId: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() value?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() percentage?: number;
}

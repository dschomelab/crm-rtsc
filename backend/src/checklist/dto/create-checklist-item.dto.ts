import { IsString, IsOptional, IsInt, IsUUID, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChecklistItemDto {
  @ApiProperty() @IsString() description: string;
  @ApiProperty() @IsUUID() serviceOrderId: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() order?: number;
}

export class UpdateChecklistItemDto {
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() completed?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() order?: number;
}

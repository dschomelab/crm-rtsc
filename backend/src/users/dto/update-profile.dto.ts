import { IsString, IsOptional, MinLength, IsPhoneNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
}

export class ChangePasswordDto {
  @ApiPropertyOptional() @IsString() currentPassword: string;
  @ApiPropertyOptional() @IsString() @MinLength(8) newPassword: string;
}

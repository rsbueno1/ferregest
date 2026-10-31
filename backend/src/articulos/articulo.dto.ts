import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateArticuloDto {
  @IsString() @IsNotEmpty() codigoBarras: string;
  @IsString() @IsNotEmpty() nombre: string;
  @IsString() @IsOptional() unidad?: string;
  @IsNumber() @Min(0) precioVenta: number;
  @IsNumber() @Min(0) @IsOptional() costo?: number;
}
export class UpdateArticuloDto extends PartialType(CreateArticuloDto) {}

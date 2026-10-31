import { Body, Controller, Get, Param, ParseIntPipe, Put } from '@nestjs/common';
import { IsInt, Min } from 'class-validator';
import { ExistenciasService } from './existencias.service';

class AjusteDto {
  @IsInt() @Min(0) cantidad: number;
}

@Controller()
export class ExistenciasController {
  constructor(private s: ExistenciasService) {}
  @Get('almacenes') almacenes() { return this.s.almacenesLista(); }
  @Get('articulos/:id/existencias') porArticulo(@Param('id', ParseIntPipe) id: number) {
    return this.s.porArticulo(id);
  }
  @Put('articulos/:id/existencias/:almacenId')
  ajustar(@Param('id', ParseIntPipe) id: number, @Param('almacenId', ParseIntPipe) almacenId: number, @Body() dto: AjusteDto) {
    return this.s.ajustar(id, almacenId, dto.cantidad);
  }
}

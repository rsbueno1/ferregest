import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ArticulosService } from './articulos.service';
import { CreateArticuloDto, UpdateArticuloDto } from './articulo.dto';

@Controller('articulos')
export class ArticulosController {
  constructor(private s: ArticulosService) {}
  @Get() findAll(@Query('q') q?: string, @Query('inactivos') inactivos?: string) {
    return this.s.findAll(q, inactivos === 'true');
  }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.s.findOne(id); }
  @Post() create(@Body() dto: CreateArticuloDto) { return this.s.create(dto); }
  @Put(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateArticuloDto) {
    return this.s.update(id, dto);
  }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.s.remove(id); }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Articulo } from '../articulos/articulo.entity';
import { Almacen } from './almacen.entity';
import { Existencia } from './existencia.entity';
import { ExistenciasService } from './existencias.service';
import { ExistenciasController } from './existencias.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Articulo, Almacen, Existencia])],
  providers: [ExistenciasService],
  controllers: [ExistenciasController],
})
export class ExistenciasModule {}

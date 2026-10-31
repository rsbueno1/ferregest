import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Articulo } from './articulo.entity';
import { ArticulosService } from './articulos.service';
import { ArticulosController } from './articulos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Articulo])],
  providers: [ArticulosService],
  controllers: [ArticulosController],
  exports: [ArticulosService],
})
export class ArticulosModule {}

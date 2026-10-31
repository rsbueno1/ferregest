import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Articulo } from '../articulos/articulo.entity';
import { Existencia } from './existencia.entity';
import { Almacen } from './almacen.entity';

@Injectable()
export class ExistenciasService {
  constructor(
    @InjectRepository(Existencia) private repo: Repository<Existencia>,
    @InjectRepository(Articulo) private articulos: Repository<Articulo>,
    @InjectRepository(Almacen) private almacenes: Repository<Almacen>,
  ) {}

  almacenesLista() { return this.almacenes.find({ order: { id: 'ASC' } }); }

  /** HU-01: existencia del artículo en cada almacén y el total. */
  async porArticulo(articuloId: number) {
    const art = await this.articulos.findOne({ where: { id: articuloId } });
    if (!art) throw new NotFoundException('Artículo no encontrado');
    const filas = await this.repo.find({ where: { articulo: { id: articuloId } }, order: { id: 'ASC' } });
    return {
      articulo: { id: art.id, nombre: art.nombre, codigoBarras: art.codigoBarras, precioVenta: art.precioVenta },
      almacenes: filas.map((f) => ({ almacenId: f.almacen.id, almacen: f.almacen.nombre, cantidad: f.cantidad })),
      total: filas.reduce((s, f) => s + f.cantidad, 0),
    };
  }

  /** Registra o corrige la cantidad en un almacén. */
  async ajustar(articuloId: number, almacenId: number, cantidad: number) {
    const articulo = await this.articulos.findOne({ where: { id: articuloId } });
    const almacen = await this.almacenes.findOne({ where: { id: almacenId } });
    if (!articulo || !almacen) throw new NotFoundException('Artículo o almacén no encontrado');
    let e = await this.repo.findOne({ where: { articulo: { id: articuloId }, almacen: { id: almacenId } } });
    if (!e) e = this.repo.create({ articulo, almacen });
    e.cantidad = cantidad;
    await this.repo.save(e);
    return this.porArticulo(articuloId);
  }
}

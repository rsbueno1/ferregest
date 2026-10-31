import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Articulo } from './articulos/articulo.entity';
import { Almacen } from './existencias/almacen.entity';
import { Existencia } from './existencias/existencia.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Articulo) private articulos: Repository<Articulo>,
    @InjectRepository(Almacen) private almacenes: Repository<Almacen>,
    @InjectRepository(Existencia) private existencias: Repository<Existencia>,
  ) {}

  async onModuleInit() {
    if ((await this.almacenes.count()) > 0) return;
    const alms = await this.almacenes.save([
      { nombre: 'Tienda principal' },
      { nombre: 'Sucursal' },
      { nombre: 'Almacén central' },
    ]);
    const arts = await this.articulos.save([
      { codigoBarras: '7460001000011', nombre: 'Cemento gris 42.5 kg', unidad: 'Saco', precioVenta: 520, costo: 410 },
      { codigoBarras: '7460001000028', nombre: 'Varilla 3/8', unidad: 'Unidad', precioVenta: 245, costo: 190 },
      { codigoBarras: '7460001000035', nombre: 'Pintura blanca 1 galón', unidad: 'Galón', precioVenta: 980, costo: 720 },
    ]);
    const cant = [[120, 40, 300], [80, 25, 500], [15, 6, 60]];
    for (let i = 0; i < arts.length; i++)
      for (let j = 0; j < alms.length; j++)
        await this.existencias.save({ articulo: arts[i], almacen: alms[j], cantidad: cant[i][j] });
  }
}

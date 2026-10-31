import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Articulo } from './articulo.entity';
import { CreateArticuloDto, UpdateArticuloDto } from './articulo.dto';

@Injectable()
export class ArticulosService {
  constructor(@InjectRepository(Articulo) private repo: Repository<Articulo>) {}

  findAll(q?: string, incluirInactivos = false) {
    const base = incluirInactivos ? {} : { activo: true };
    const where = q
      ? [{ ...base, nombre: ILike(`%${q}%`) }, { ...base, codigoBarras: ILike(`%${q}%`) }]
      : base;
    return this.repo.find({ where, order: { nombre: 'ASC' } });
  }

  async findOne(id: number) {
    const a = await this.repo.findOne({ where: { id } });
    if (!a) throw new NotFoundException(`Artículo ${id} no encontrado`);
    return a;
  }

  async create(dto: CreateArticuloDto) {
    if (await this.repo.findOne({ where: { codigoBarras: dto.codigoBarras } }))
      throw new ConflictException('Ya existe un artículo con ese código de barras');
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateArticuloDto) {
    const a = await this.findOne(id);
    if (dto.codigoBarras && dto.codigoBarras !== a.codigoBarras &&
        (await this.repo.findOne({ where: { codigoBarras: dto.codigoBarras } })))
      throw new ConflictException('Ya existe un artículo con ese código de barras');
    return this.repo.save(Object.assign(a, dto));
  }

  /** Eliminación lógica: se desactiva para no perder el historial. */
  async remove(id: number) {
    const a = await this.findOne(id);
    a.activo = false;
    await this.repo.save(a);
    return { id, desactivado: true };
  }
}

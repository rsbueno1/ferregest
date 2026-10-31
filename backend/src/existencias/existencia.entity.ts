import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Articulo } from '../articulos/articulo.entity';
import { Almacen } from './almacen.entity';

@Entity('existencias')
@Unique(['articulo', 'almacen'])
export class Existencia {
  @PrimaryGeneratedColumn() id: number;
  @ManyToOne(() => Articulo, (a) => a.existencias, { onDelete: 'CASCADE' }) articulo: Articulo;
  @ManyToOne(() => Almacen, { eager: true }) almacen: Almacen;
  @Column('int', { default: 0 }) cantidad: number;
}

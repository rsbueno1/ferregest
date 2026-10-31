import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Existencia } from '../existencias/existencia.entity';

const num = { to: (v: number) => v, from: (v: string) => parseFloat(v) };

@Entity('articulos')
export class Articulo {
  @PrimaryGeneratedColumn() id: number;
  @Column({ unique: true }) codigoBarras: string;
  @Column() nombre: string;
  @Column({ default: 'Unidad' }) unidad: string;
  @Column('numeric', { precision: 12, scale: 2, transformer: num }) precioVenta: number;
  @Column('numeric', { precision: 12, scale: 2, default: 0, transformer: num }) costo: number;
  @Column({ default: true }) activo: boolean;
  @OneToMany(() => Existencia, (e) => e.articulo) existencias: Existencia[];
}

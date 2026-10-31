import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Articulo } from './articulos/articulo.entity';
import { Almacen } from './existencias/almacen.entity';
import { Existencia } from './existencias/existencia.entity';
import { ArticulosModule } from './articulos/articulos.module';
import { ExistenciasModule } from './existencias/existencias.module';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'ferregest',
      password: process.env.DB_PASS || 'ferregest',
      database: process.env.DB_NAME || 'ferregest',
      entities: [Articulo, Almacen, Existencia],
      synchronize: true, // solo para el entorno académico
    }),
    TypeOrmModule.forFeature([Articulo, Almacen, Existencia]),
    ArticulosModule,
    ExistenciasModule,
  ],
  providers: [SeedService],
})
export class AppModule {}

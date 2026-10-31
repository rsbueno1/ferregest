import { ConflictException, NotFoundException } from '@nestjs/common';
import { ArticulosService } from './articulos.service';

const mockRepo = () => ({
  find: jest.fn(), findOne: jest.fn(),
  create: jest.fn((x) => x), save: jest.fn(async (x) => ({ id: 1, ...x })),
});

describe('ArticulosService', () => {
  let repo: any; let service: ArticulosService;
  beforeEach(() => { repo = mockRepo(); service = new ArticulosService(repo); });

  it('crea un artículo nuevo', async () => {
    repo.findOne.mockResolvedValue(null);
    const r = await service.create({ codigoBarras: '1', nombre: 'Martillo', precioVenta: 300 });
    expect(r.id).toBe(1);
  });
  it('rechaza código de barras duplicado', async () => {
    repo.findOne.mockResolvedValue({ id: 9 });
    await expect(service.create({ codigoBarras: '1', nombre: 'X', precioVenta: 1 })).rejects.toBeInstanceOf(ConflictException);
  });
  it('lanza 404 si no existe', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.findOne(5)).rejects.toBeInstanceOf(NotFoundException);
  });
  it('desactiva en lugar de borrar', async () => {
    repo.findOne.mockResolvedValue({ id: 2, activo: true });
    const r = await service.remove(2);
    expect(r.desactivado).toBe(true);
    expect(repo.save).toHaveBeenCalledWith({ id: 2, activo: false });
  });
  it('actualiza campos', async () => {
    repo.findOne.mockResolvedValue({ id: 3, nombre: 'A', codigoBarras: '1' });
    const r = await service.update(3, { nombre: 'B' });
    expect(r.nombre).toBe('B');
  });
});

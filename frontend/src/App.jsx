import { useEffect, useState } from 'react';
import { api } from './api.js';

const VACIO = { codigoBarras: '', nombre: '', unidad: 'Unidad', precioVenta: '', costo: '' };
const money = (n) => new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(n ?? 0);

export default function App() {
  const [articulos, setArticulos] = useState([]);
  const [q, setQ] = useState('');
  const [inactivos, setInactivos] = useState(false);
  const [form, setForm] = useState(null);
  const [editId, setEditId] = useState(null);
  const [stock, setStock] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [cargando, setCargando] = useState(true);

  const avisar = (tipo, texto) => { setAviso({ tipo, texto }); setTimeout(() => setAviso(null), 4000); };

  const cargar = async () => {
    try { setArticulos(await api.listar(q, inactivos)); }
    catch (e) { avisar('error', e.message); }
    finally { setCargando(false); }
  };
  useEffect(() => { const t = setTimeout(cargar, 250); return () => clearTimeout(t); }, [q, inactivos]);

  const abrirNuevo = () => { setEditId(null); setForm(VACIO); };
  const abrirEditar = (a) => { setEditId(a.id); setForm({ ...a }); };

  const guardar = async (e) => {
    e.preventDefault();
    const body = {
      codigoBarras: form.codigoBarras.trim(), nombre: form.nombre.trim(), unidad: (form.unidad || '').trim() || 'Unidad',
      precioVenta: Number(form.precioVenta), costo: Number(form.costo || 0),
    };
    try {
      if (editId) { await api.editar(editId, body); avisar('ok', 'Artículo actualizado'); }
      else { await api.crear(body); avisar('ok', 'Artículo creado'); }
      setForm(null); cargar();
    } catch (err) { avisar('error', err.message); }
  };

  const desactivar = async (a) => {
    if (!confirm(`¿Desactivar «${a.nombre}»? Dejará de aparecer en el catálogo.`)) return;
    try { await api.desactivar(a.id); avisar('ok', 'Artículo desactivado'); cargar(); }
    catch (err) { avisar('error', err.message); }
  };

  const verStock = async (a) => {
    try { setStock(await api.existencias(a.id)); }
    catch (err) { avisar('error', err.message); }
  };

  const guardarStock = async (almacenId, valor) => {
    try { setStock(await api.ajustar(stock.articulo.id, almacenId, Number(valor))); avisar('ok', 'Existencia actualizada'); }
    catch (err) { avisar('error', err.message); }
  };

  return (
    <div className="app">
      <header className="top">
        <div>
          <h1>FerreGest</h1>
          <p>Catálogo e inventario · Ferretería El Constructor del Valle</p>
        </div>
        <button className="btn primary" onClick={abrirNuevo}>Nuevo artículo</button>
      </header>

      {aviso && <div className={`aviso ${aviso.tipo}`} role="status">{aviso.texto}</div>}

      <div className="barra">
        <input type="search" placeholder="Buscar por nombre o código de barras" value={q}
          onChange={(e) => setQ(e.target.value)} aria-label="Buscar artículos" />
        <label className="check">
          <input type="checkbox" checked={inactivos} onChange={(e) => setInactivos(e.target.checked)} />
          Mostrar desactivados
        </label>
      </div>

      <div className="tabla-wrap">
        <table>
          <thead>
            <tr><th>Código</th><th>Artículo</th><th>Unidad</th><th className="num">Precio</th><th className="num">Costo</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {cargando && <tr><td colSpan="7" className="vacio">Cargando artículos…</td></tr>}
            {!cargando && articulos.length === 0 && (
              <tr><td colSpan="7" className="vacio">No hay artículos con ese criterio. Crea uno con «Nuevo artículo».</td></tr>
            )}
            {articulos.map((a) => (
              <tr key={a.id} className={a.activo ? '' : 'inactivo'}>
                <td className="mono">{a.codigoBarras}</td>
                <td>{a.nombre}</td>
                <td>{a.unidad}</td>
                <td className="num">{money(a.precioVenta)}</td>
                <td className="num">{money(a.costo)}</td>
                <td>{a.activo ? 'Activo' : 'Desactivado'}</td>
                <td><div className="acciones">
                  <button className="btn" onClick={() => verStock(a)}>Existencias</button>
                  <button className="btn" onClick={() => abrirEditar(a)}>Editar</button>
                  {a.activo && <button className="btn peligro" onClick={() => desactivar(a)}>Desactivar</button>}
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form && (
        <div className="modal" role="dialog" aria-modal="true" onClick={() => setForm(null)}>
          <form className="panel" onSubmit={guardar} onClick={(e) => e.stopPropagation()}>
            <h2>{editId ? 'Editar artículo' : 'Nuevo artículo'}</h2>
            <label>Código de barras
              <input required value={form.codigoBarras} onChange={(e) => setForm({ ...form, codigoBarras: e.target.value })} />
            </label>
            <label>Nombre
              <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            </label>
            <label>Unidad de medida
              <input value={form.unidad} onChange={(e) => setForm({ ...form, unidad: e.target.value })} />
            </label>
            <div className="dos">
              <label>Precio de venta
                <input required type="number" min="0" step="0.01" value={form.precioVenta}
                  onChange={(e) => setForm({ ...form, precioVenta: e.target.value })} />
              </label>
              <label>Costo
                <input type="number" min="0" step="0.01" value={form.costo}
                  onChange={(e) => setForm({ ...form, costo: e.target.value })} />
              </label>
            </div>
            <div className="fila-fin">
              <button type="button" className="btn" onClick={() => setForm(null)}>Cancelar</button>
              <button type="submit" className="btn primary">Guardar artículo</button>
            </div>
          </form>
        </div>
      )}

      {stock && (
        <div className="modal" role="dialog" aria-modal="true" onClick={() => setStock(null)}>
          <div className="panel" onClick={(e) => e.stopPropagation()}>
            <h2>{stock.articulo.nombre}</h2>
            <p className="sub">Código {stock.articulo.codigoBarras} · {money(stock.articulo.precioVenta)}</p>
            <table className="stock">
              <thead><tr><th>Almacén</th><th className="num">Existencia</th></tr></thead>
              <tbody>
                {stock.almacenes.map((al) => <FilaStock key={al.almacenId} al={al} onGuardar={guardarStock} />)}
              </tbody>
              <tfoot><tr><th>Total</th><th className="num">{stock.total}</th></tr></tfoot>
            </table>
            <div className="fila-fin"><button className="btn primary" onClick={() => setStock(null)}>Cerrar</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilaStock({ al, onGuardar }) {
  const [v, setV] = useState(al.cantidad);
  useEffect(() => setV(al.cantidad), [al.cantidad]);
  return (
    <tr>
      <td>{al.almacen}</td>
      <td className="num">
        <input type="number" min="0" value={v} onChange={(e) => setV(e.target.value)} className="mini" aria-label={`Existencia en ${al.almacen}`} />
        <button className="btn" disabled={Number(v) === al.cantidad} onClick={() => onGuardar(al.almacenId, v)}>Guardar</button>
      </td>
    </tr>
  );
}

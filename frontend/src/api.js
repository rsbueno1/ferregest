const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function req(path, options) {
  const res = await fetch(BASE + path, { headers: { 'Content-Type': 'application/json' }, ...options });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = Array.isArray(data.message) ? data.message.join('. ') : data.message;
    throw new Error(msg || 'No se pudo completar la operación');
  }
  return data;
}

export const api = {
  listar: (q = '', inactivos = false) => req(`/articulos?q=${encodeURIComponent(q)}&inactivos=${inactivos}`),
  crear: (a) => req('/articulos', { method: 'POST', body: JSON.stringify(a) }),
  editar: (id, a) => req(`/articulos/${id}`, { method: 'PUT', body: JSON.stringify(a) }),
  desactivar: (id) => req(`/articulos/${id}`, { method: 'DELETE' }),
  existencias: (id) => req(`/articulos/${id}/existencias`),
  ajustar: (id, almacenId, cantidad) =>
    req(`/articulos/${id}/existencias/${almacenId}`, { method: 'PUT', body: JSON.stringify({ cantidad }) }),
};

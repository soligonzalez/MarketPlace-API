import { ProductoAPI, ProductoVista, eliminarProducto } from './clases.js';

document.addEventListener('DOMContentLoaded', async () => {
  const api = new ProductoAPI();
  let productos = [];
  let usuarioActual = null;

  try {
    const usuarioRes = await fetch('/api/usuario');
    if (usuarioRes.ok) {
      const usuarioData = await usuarioRes.json();
      usuarioActual = usuarioData.usuario;
    }

    productos = await api.obtenerProductos();
    const vista = new ProductoVista('productos-container', usuarioActual);
    vista.mostrarProductos(productos);

    // Filtro por categoría
    document.querySelectorAll('.filtro-categoria').forEach(el =>
      el.addEventListener('click', () => {
        const cat = el.dataset.categoria;
        vista.mostrarProductos(
          cat === 'Todos' ? productos : productos.filter(p => p.categoria === cat)
        );
      })
    );

    // Búsqueda
    document.querySelector('.search-box').addEventListener('input', e => {
      const txt = e.target.value.trim().toLowerCase();
      vista.mostrarProductos(
        productos.filter(p =>
          p.nombre.toLowerCase().includes(txt) ||
          p.descripcion.toLowerCase().includes(txt)
        )
      );
    });

  } catch (error) {
    const vista = new ProductoVista('productos-container', null);
    vista.mostrarNotificacion('Error al cargar productos', false);
  }
});




    









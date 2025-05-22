// public/js/publicar.js
import { ProductoAPI, FormularioProducto } from './clases.js';

document.addEventListener('DOMContentLoaded', () => {
  const api = new ProductoAPI();

  const formulario = new FormularioProducto('form-producto', async (producto) => {
    try {
      const resultado = await api.guardarProducto(producto);
      if (resultado.success) {
        alert('✅ Producto cargado exitosamente');
        formulario.limpiar();
        window.location.href = '/';
      } else {
        alert('❌ Error al cargar el producto');
      }
    } catch (error) {
      alert('❌ Error al procesar la solicitud');
    }
  });
});

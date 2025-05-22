// public/js/home.js
import { ProductoAPI, ProductoVista } from './clases.js';

document.addEventListener('DOMContentLoaded', async () => {
  const api = new ProductoAPI();
  const vista = new ProductoVista('productos-container');

  console.log("🌱 Evento DOMContentLoaded disparado");

let productos = [];

  try {
    console.log("🔎 Llamando a obtenerProductos...");
     productos = await api.obtenerProductos();
    console.log("📦 Productos recibidos:", productos);

    vista.mostrarProductos(productos);
  } catch (error) {
    console.error("❌ Error al cargar productos:", error);
    vista.mostrarNotificacion('Error al cargar productos', false);
  }

const botonesFiltro = document.querySelectorAll('.filter-btn');
console.log("🎯 Botones encontrados:", botonesFiltro.length);

  botonesFiltro.forEach(boton => {
    boton.addEventListener('click', () => {
      const categoriaSeleccionada = boton.textContent;
      if (categoriaSeleccionada === 'Todos') {
        vista.mostrarProductos(productos);
        return; // salimos para no filtrar más
      }
      const filtrados = productos.filter(p => p.categoria === categoriaSeleccionada);
      vista.mostrarProductos(filtrados);
    });
  });
});






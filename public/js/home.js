// public/js/home.js
import { ProductoAPI, ProductoVista } from './clases.js';

document.addEventListener('DOMContentLoaded', async () => {
  const api = new ProductoAPI();
  const vista = new ProductoVista('productos-container');

let productos = [];

  try {
     productos = await api.obtenerProductos();
    vista.mostrarProductos(productos);
  } catch (error) {
    vista.mostrarNotificacion('Error al cargar productos', false);
  }

const botonesFiltro = document.querySelectorAll('.filter-btn');
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
    const buscador = document.querySelector('.search-box');
    buscador.addEventListener('input', () => {
    const texto = buscador.value.trim();
    const filtrados = productos.filter(p =>
      p.nombre.includes(texto) || p.descripcion.includes(texto)
    );
    vista.mostrarProductos(filtrados);
  });
});






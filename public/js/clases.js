export class ProductoAPI {
  constructor() {
    this.apiUrl = '/productos';
  }

  async obtenerProductos() {
    try {
      const respuesta = await fetch(this.apiUrl);
      return await respuesta.json();
    } catch (error) {
      throw error;
    }
  }

  async guardarProducto(producto) {
    try {
      const respuesta = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
      });
      return await respuesta.json();
    } catch (error) {
      throw error;
    }
  }
}

// muestra los productos en la página
export class ProductoVista {
  constructor(contenedorId) {
    this.contenedor = document.getElementById(contenedorId);
  }

  mostrarProductos(productos) {
    this.contenedor.innerHTML = '';
    if (productos.length === 0) {
      this.mostrarMensajeVacio();
      return;
    }

    productos.forEach(producto => {
      const elemento = this.crearElementoProducto(producto);
      this.contenedor.appendChild(elemento);
    });
  }

  crearElementoProducto(producto) {
    const div = document.createElement('div');
    div.classList.add('producto');
    div.innerHTML = `
      <h3>${producto.nombre}</h3>
      <p><strong>Categoría:</strong> ${producto.categoria}</p>
      <p><strong>Precio:</strong> $${producto.precio}</p>
      <p>${producto.descripcion}</p>
      ${producto.imagen ? `<img src="${producto.imagen}" alt="${producto.nombre}" style="max-width: 200px;">` : ''}
      ${producto.vendedor ? `<p><strong>Vendedor:</strong> ${producto.vendedor}</p>` : ''}
      ${producto.whatsapp ? `<p><a href="https://wa.me/${producto.whatsapp}" target="_blank" class="whatsapp-btn">📱 Contactar por WhatsApp</a></p>` : ''}

      <hr>
    `;
    return div;
  }

  mostrarMensajeVacio() {
    this.contenedor.innerHTML = '<p class="mensaje-vacio">No hay productos disponibles</p>';
  }

  mostrarNotificacion(mensaje, esExito = true) {
    alert(`${esExito ? '✅' : '❌'} ${mensaje}`);
  }
}

// maneja el envío del formulario
export class FormularioProducto {
  constructor(formularioId, alEnviar) {
    this.formulario = document.getElementById(formularioId);
    this.callbackEnvio = alEnviar;
    if (!this.formulario) {
      throw new Error(`Formulario con ID ${formularioId} no encontrado`);
    }
    this.formulario.addEventListener('submit', this.manejarEnvio.bind(this));
  }

  manejarEnvio(evento) {
    evento.preventDefault();

    const imagenUrl = this.formulario.imagen.value;

    const esValida = /\.(jpeg|jpg|png|gif|webp)$/i.test(imagenUrl);
  if (imagenUrl && !esValida) {
    alert('La URL de la imagen debe terminar en .jpg, .jpeg, .png, .gif o .webp');
    return;
  }
    const producto = {
      nombre: this.formulario.nombre.value,
      categoria: this.formulario.categoria.value,
      precio: parseFloat(this.formulario.precio.value),
      descripcion: this.formulario.descripcion.value,
      imagen: this.formulario.imagen.value,
      whatsapp: this.formulario.whatsapp.value,
    };
    this.callbackEnvio(producto);
  }

  limpiar() {
    this.formulario.reset();
  }
}


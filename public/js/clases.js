export class ProductoAPI {
  constructor() {
    this.apiUrl = '/productos';
  }

  async obtenerProductos() {
    const respuesta = await fetch(this.apiUrl);
    return await respuesta.json();
  }

  async guardarProducto(producto) {
    const respuesta = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    });
    return await respuesta.json();
  }

  async eliminarProducto(id) {
    const respuesta = await fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE'
    });
    return await respuesta.json();
  }
}

export class ProductoVista {
  constructor(contenedorId, usuarioActual = null) {
    this.contenedor = document.getElementById(contenedorId);
    this.usuarioActual = usuarioActual;
  }

  mostrarProductos(productos) {
    this.contenedor.innerHTML = '';
    if (productos.length === 0) return this.mostrarMensajeVacio();
    productos.forEach(p =>
      this.contenedor.appendChild(this.crearElementoProducto(p))
    );
  }

  crearElementoProducto(p) {
    const div = document.createElement('div');
    div.className = 'col-12 col-sm-6 col-md-4 col-lg-3';
    const usuario = this.usuarioActual || {};

    div.innerHTML = `
      <div class="card h-100 shadow-sm border-0" style="border-radius: 15px;">
        ${p.imagen ? `<img src="${p.imagen}" class="card-img-top" alt="${p.nombre}" style="object-fit: cover; height: 180px; border-top-left-radius: 15px; border-top-right-radius: 15px;">` : ''}
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.nombre}</h5>
          <p class="card-text"><strong>Categoría:</strong> ${p.categoria}</p>
          <p class="card-text"><strong>Precio ARS (kg):</strong> $${p.precio}</p>
          <p class="card-text">${p.descripcion}</p>
          ${p.vendedor ? `<p class="card-text"><strong>Vendedor:</strong> ${p.vendedor}</p>` : ''}
          ${p.whatsapp ? `<a href="https://wa.me/${p.whatsapp}" target="_blank" class="btn btn-whatsapp mb-2">📱 WhatsApp</a>` : ''}
          ${(usuario?.email && usuario.email === p.email) ? `
            <a href="/editar.html?id=${p._id}" class="btn btn-sm btn-outline-primary mb-1">✏ Editar</a>
            <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto('${p._id}')">🗑 Eliminar</button>
          ` : ''}
        </div>
      </div>
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

export class FormularioProducto {
  constructor(formularioId, alEnviar) {
    this.formulario = document.getElementById(formularioId);
    this.callbackEnvio = alEnviar;
    if (!this.formulario) throw new Error(`Formulario con ID ${formularioId} no encontrado`);
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
    this.limpiar();
  }

  limpiar() {
    this.formulario.reset();
  }
}

// ✅ Eliminar producto como función global, pero dejarlo accesible
export async function eliminarProducto(id) {
  if (!confirm("¿Estás seguro que querés eliminar este producto?")) return;
  try {
    const api = new ProductoAPI();
    const res = await api.eliminarProducto(id);
    if (res.success) {
      alert("Producto eliminado correctamente");
      location.reload();
    } else {
      alert("Error al eliminar el producto");
    }
  } catch (err) {
    alert("Error al procesar la solicitud");
  }
}





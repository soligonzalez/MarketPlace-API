document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return alert('ID de producto no encontrado');

  // Obtener datos del producto actual
  try {
    const res = await fetch(`/productos/${id}`);
    if (!res.ok) return alert("Error al cargar el producto");
    const producto = await res.json();

    const form = document.getElementById('form-editar');
    form.nombre.value = producto.nombre;
    form.categoria.value = producto.categoria;
    form.precio.value = producto.precio;
    form.descripcion.value = producto.descripcion;
    form.imagen.value = producto.imagen;
    form.whatsapp.value = producto.whatsapp;
    document.getElementById('id-producto').value = producto._id;

    // Al enviar el formulario
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const datosActualizados = {
        nombre: form.nombre.value,
        categoria: form.categoria.value,
        precio: parseFloat(form.precio.value),
        descripcion: form.descripcion.value,
        imagen: form.imagen.value,
        whatsapp: form.whatsapp.value,
      };

      const actualizar = await fetch(`/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosActualizados)
      });

      const resultado = await actualizar.json();
      if (resultado.success) {
        alert('✅ Producto actualizado correctamente');
        window.location.href = '/';
      } else {
        alert('❌ Error al actualizar: ' + (resultado.mensaje || ''));
      }
    });
  } catch (err) {
    alert('Error al cargar datos del producto');
  }
});

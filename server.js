import express from 'express';
import db from './db.js';
import passport from 'passport';
import Authentication from "./auth.js";
import path from 'path';
import fs from 'fs';
import configurarSwagger from './swagger.js';
import './swaggerDoc.js';




const dirname = fs.realpathSync('.');

class AgroBackendServer {
  constructor() {
    const app = express();
    configurarSwagger(app);
    app.use(express.json());
    app.use(express.static('public'));
    app.use(express.urlencoded({ extended: false }));

    const authentication = new Authentication(app);

    // AUTENTICACIÓN
    app.post("/register", this.register);
    app.post("/login", this.loginManual);
    app.post("/loginmanual", this.loginManual);
    app.post("/logout", (req, res) => {
      req.logout(err => {
        if (err) console.error("Error al hacer logout:", err);
        res.redirect("/login");
      });
    });

    app.get('/auth/google/', passport.authenticate('google', {
      scope: ['email', 'profile']
    }));

    app.get('/auth/google/callback', passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));

    app.get('/register', this.showRegister);
    app.get('/login/', this.login);
    app.get('/', authentication.checkAuthenticated, this.goHome);

    // PRODUCTOS
    app.post('/productos', authentication.checkAuthenticated, this.guardarProducto);

    app.get('/productos', async (req, res) => {
      try {
        const productos = await db.collection("Productos").find().toArray();
        res.json(productos);
      } catch (e) {
        console.error("Error al obtener productos:", e);
        res.status(500).json({ success: false, mensaje: "Error al obtener productos" });
      }
    });

    // Obtener un producto por ID
    app.get('/productos/:id', async (req, res) => {
      try {
        const producto = await db.collection("Productos").findOne({ _id: new ObjectId(req.params.id) });
        if (!producto) return res.status(404).json({ success: false, mensaje: "Producto no encontrado" });
        res.json(producto);
      } catch (error) {
        console.error("Error al obtener producto:", error);
        res.status(500).json({ success: false, mensaje: "Error interno" });
      }
    });

    // Editar un producto solo si es del usuario actual
    app.put('/productos/:id', async (req, res) => {
      try {
        const id = new ObjectId(req.params.id);
        const producto = await db.collection("Productos").findOne({ _id: id });
        if (!producto) return res.status(404).json({ success: false, mensaje: "Producto no encontrado" });

        if (producto.email !== req.user.email) {
          return res.status(403).json({ success: false, mensaje: "No tenés permiso para editar este producto" });
        }

        await db.collection("Productos").updateOne(
          { _id: id },
          {
            $set: {
              nombre: req.body.nombre,
              categoria: req.body.categoria,
              descripcion: req.body.descripcion,
              precio: parseFloat(req.body.precio),
              imagen: req.body.imagen,
              whatsapp: req.body.whatsapp,
            }
          }
        );

        res.json({ success: true, mensaje: "Producto actualizado correctamente" });
      } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ success: false, mensaje: "Error al actualizar" });
      }
    });

    // Eliminar un producto solo si es del usuario actual
    app.delete('/productos/:id', async (req, res) => {
      try {
        const id = new ObjectId(req.params.id);
        const producto = await db.collection("Productos").findOne({ _id: id });
        if (!producto) return res.status(404).json({ success: false, mensaje: "Producto no encontrado" });

        if (producto.email !== req.user.email) {
          return res.status(403).json({ success: false, mensaje: "No tenés permiso para eliminar este producto" });
        }

        await db.collection("Productos").deleteOne({ _id: id });
        res.json({ success: true, mensaje: "Producto eliminado correctamente" });
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ success: false, mensaje: "Error al eliminar" });
      }
    });

    // Obtener usuario autenticado
    app.get('/api/usuario', (req, res) => {
      if (!req.user) return res.status(401).json({ usuario: null });
      res.json({ usuario: { email: req.user.email, nombre: req.user.displayName || req.user.name } });
    });

    // Servidor corriendo
    aapp.listen(process.env.PORT || 3000, () => {
    console.log('Servidor corriendo...');
  });
  }

  async showRegister(req, res) {
    res.sendFile(path.join(dirname, "public/register.html"));
  }

  async login(req, res) {
    res.sendFile(path.join(dirname, "public/login.html"));
  }

  async goHome(req, res) {
    res.sendFile(path.join(dirname, "public/home.html"));
  }

  async guardarProducto(req, res) {
    try {
      const producto = {
        nombre: req.body.nombre,
        categoria: req.body.categoria,
        descripcion: req.body.descripcion,
        precio: parseFloat(req.body.precio),
        imagen: req.body.imagen,
        vendedor: req.user.displayName || req.user.name,
        email: req.user.email,
        whatsapp: req.body.whatsapp,
      };
      await db.collection("Productos").insertOne(producto);
      res.json({ success: true, mensaje: "Producto guardado con éxito" });
    } catch (err) {
      console.error("Error al guardar producto:", err);
      res.status(500).json({ success: false, mensaje: "Error al guardar producto" });
    }
  }

  async register(req, res) {
    try {
      const { username, password } = req.body;
      const collection = db.collection("Usuarios");
      const existingUser = await collection.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ success: false, mensaje: "El usuario ya existe" });
      }
      await collection.insertOne({ username, password });
      res.status(200).json({ success: true, mensaje: "Usuario registrado con éxito" });
    } catch (err) {
      console.error("Error al registrar usuario:", err);
      res.status(500).json({ success: false, mensaje: "Error al registrar usuario" });
    }
  }

  async loginManual(req, res) {
    try {
      const { username, password } = req.body;
      const usuario = await db.collection("Usuarios").findOne({ username });
      if (!usuario || usuario.password !== password) {
        return res.status(401).json({ mensaje: "Credenciales inválidas" });
      }
      req.login(usuario, err => {
        if (err) return res.status(500).json({ mensaje: "Error al guardar sesión" });
        return res.json({ success: true });
      });
    } catch (err) {
      console.error("Error login:", err);
      res.status(500).json({ mensaje: "Error del servidor" });
    }
  }
}

new AgroBackendServer();

  


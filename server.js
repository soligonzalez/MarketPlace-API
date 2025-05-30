import express from 'express';
import db from './db.js';
import passport from 'passport';
import Authentication from "./auth.js"
import path from 'path';
import fs from 'fs';

const dirname = fs.realpathSync('.');

class DictionaryBackendServer {
  constructor() {
    
    const app = express();
    app.use(express.json());
    app.use(express.static('public'));
    app.use(express.urlencoded({ extended: false }));
    const authentication = new Authentication(app);

    
    app.post("/register", this.register);
    app.post("/login", this.loginManual);
    app.post("/logout", (req, res) => {
      req.logout(err => {
          if (err) {
            console.error("Error al hacer logout:", err);
          }
          res.redirect("/login");
        });
      });


    
    app.get('/register', this.showRegister);
    app.get('/login/', this.login);
    app.get('/', authentication.checkAuthenticated, this.goHome);



    // aca empiezan las diferencias con autenticacion local
    app.get('/auth/google/', passport.authenticate('google', {
       scope: ['email', 'profile']
      }));

    app.get('/auth/google/callback', passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));

    // hace un post mandando los datos a la bd para comprobar si el usuario y contraseña ya estan en la base de datos.
    app.post("/loginmanual", this.loginManual);

    
   // ruta para guardar los productos, solo cuando estas logueado
    app.post('/productos', authentication.checkAuthenticated, this.guardarProducto);

    app.get('/productos', async (req, res) => {
  try {
    const collection = db.collection("Productos");
    const productos = await collection.find().toArray();
    res.json(productos);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).json({ success: false, mensaje: "Error al obtener productos" });
  }
});


   
    // levanta el servidor
    app.listen(3000, () => console.log('Listening on port 3000'));
  }

  

  async showRegister(req, res) {
  res.sendFile(path.join(dirname, "public/register.html"));
  }

  async login(req, res) {
    res.sendFile(path.join(dirname, "public/login.html"));
  }


  async goHome(req, res) {
    res.sendFile(path.join( dirname, "public/home.html"));
  }
 
//guarda productos creados por el usuario
  async guardarProducto(req, res) {
    try {
      const producto = {
        nombre: req.body.nombre,
        categoria: req.body.categoria,
        descripcion: req.body.descripcion,
        precio: parseFloat(req.body.precio),
        imagen: req.body.imagen,
        vendedor: req.user.displayName,
        email: req.user.email,
        whatsapp: req.body.whatsapp, 
      };

      const collection = db.collection("Productos");
      await collection.insertOne(producto);

      res.json({ success: true, mensaje: "Producto guardado con éxito" });
    } catch (err) {
      res.status(500).json({ success: false, mensaje: "Error al guardar el producto" });
    }
  }

  // Función para registrar un nuevo usuario manualmente
async register(req, res) {
  try {
    const { username, password } = req.body;
    const collection = db.collection("Usuarios");

    // Verifica si ya existe un usuario con ese nombre
    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, mensaje: "El usuario ya existe" });
    }

    // Crea el nuevo usuario
    await collection.insertOne({ username, password });
    res.status(200).json({ success: true, mensaje: "Usuario registrado con éxito" });
  } catch (err) {
    res.status(500).json({ success: false, mensaje: "Error al registrar usuario" });
  }
}

async loginManual(req, res) {
  try {
    const { username, password } = req.body;
    const collection = db.collection("Usuarios");
    const usuario = await collection.findOne({ username });

    if (!usuario || usuario.password !== password) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

  req.login(usuario, (err) => {
    if (err) {
      return res.status(500).json({ mensaje: "Error al guardar sesión" });
    }
    return res.json({ success: true });
  });
  } catch (err) {
    res.status(500).json({ mensaje: "Error del servidor" });
  }
}



}



new DictionaryBackendServer();



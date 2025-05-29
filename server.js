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

    app.post("/logout", (req,res) => {
     req.logOut(err=>console.log(err));
     res.redirect("/login");
   })

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
}



new DictionaryBackendServer();



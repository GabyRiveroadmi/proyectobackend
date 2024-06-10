import { Router } from "express";

const router = Router();

const cart = [];

//Crear un nuevo carrito: 

router.post("/", (req,res) => {
    const nuevoCarrito = req.body;
    cart.push(nuevoCarrito); 
    res.send({status:"success",message:"Carrito creado exitoso"});
      
  })
  
//Listar los productos:


  router.get("/", (req, res) => {
    res.send("Seccion carrito");
}) 


//Agregar el producto al arreglo “products” del carrito seleccionado



export default router 
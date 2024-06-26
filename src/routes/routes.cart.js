import express from "express";
import CartManager from "../controllers/cart-manager.js";

const router = express.Router();
const cartManager = new CartManager("./src/fs/carrito.json");

// nuevo carrito
router.post("/", async (req, res) => {
 try {
 const nuevoCarrito = await cartManager.crearCarrito();
 res.json(nuevoCarrito);
} catch (error) {
console.error("Error al crear un nuevo carrito", error);
res.status(500).json({ error: "Error interno del servidor" });
    }
});

//Listamos los productos de un determinado carrito
router.get("/:cid", async (req, res) => {
const cartId = parseInt(req.params.cid);

try {
  const carrito = await cartManager.getCarritoById(cartId);
 res.json(carrito.products);
 } catch (error) {
console.error("Error al obtener el carrito", error);
res.status(500).json({ error: "Error interno del servidor" });
    }
});

//Agregar productos a distintos carritos
router.post("/:cid/product/:pid", async (req, res) => {
 const cartId = parseInt(req.params.cid);
 const productId = req.params.pid;
 const quantity = req.body.quantity || 1;

  try {    
 const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
res.json(actualizarCarrito.products);
} catch (error) {
     console.error("Error al agregar producto al carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
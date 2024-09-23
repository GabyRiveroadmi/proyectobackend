import express from "express";
import CartManager from "../dao/db/cart-manager-db.js";
import CartModel from "../dao/fs/data/cart.model.js";
import ProductModel from "../models/productos.model.js";
import UsuarioModel from "../models/user.model.js";
import TicketModel from "../dao/fs/data/tickets.model.js";
import { calcularTotal } from "../util/hashbcrypt.js";


const router = express.Router();
const cartManager = new CartManager();


// Listar los carritos existentes(OK)

router.get("/", async (req, res) => {
    try {
    const limit = req.query.limit;
    const carritos = await cartManager.getCarritos();
       if (limit) {
           res.json(carritos.slice(0, limit));
       } else {
           res.json(carritos);
       }
   } catch (error) {
       console.error("Error al obtener los carritos", error);
       res.status(500).json({
           error: "Error interno del servidor"
       });
   }
});



// Nuevo carrito (OK)
router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({ error: "Error interno al crear nuevo carrito" });
    }
});

//Listar los productos de un carrito (ok)
router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carrito = await CartModel.findById(cartId)
            
        if (!carrito) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        return res.json(carrito.products);
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno para listar productos del carrito seleccionado" });
    }
});


//Agregar producto al carrito (ok)

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
        res.json(actualizarCarrito.products);
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({ error: "Error al agregar producto al carrito" });
    }
});

//eliminar del carrito el producto seleccionado 

router.delete("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const actualizarCarrito = await cartManager.eliminarProductoDelCarrito(cartId, productId);
        res.json(actualizarCarrito.products);
    } catch (error) {
        console.error("Error al eliminar producto del carrito", error);
        res.status(500).json({ error: "Error al eliminar producto del carrito" });
    }
});

// Eliminar todos los productos del carrito (ok)
router.delete("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carritoVacio = await cartManager.eliminarTodosLosProductosDelCarrito(cartId);
        res.json(carritoVacio.products);
    } catch (error) {
        console.error("Error al eliminar todos los productos del carrito", error);
        res.status(500).json({ error: "Error al eliminar todos los productos del carrito" });
    }
});

// BE II

router.get("/:cid/purchase", async (req, res) => {
    const carritoId = req.params.cid;
    try {
        const carrito = await CartModel.findById(carritoId);
        const arrayProductos = carrito.products;

        const productosNoDisponibles = [];

        for (const item of arrayProductos) {
            const productId = item.product;
            const product = await ProductModel.findById(productId);
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();
            } else {
                productosNoDisponibles.push(productId);
            }
        } 

        const usuarioDelCarrito = await UsuarioModel.findOne({cart: carritoId});

        const ticket = new TicketModel({
            purchase_datetime: new Date(), 
            amount: calcularTotal(carrito.products),
            purchaser: usuarioDelCarrito.email
        })

        await ticket.save(); 

        carrito.products = carrito.products.filter(item => productosNoDisponibles.some(productoId => productoId.equals(item.product))); 

        await carrito.save(); 

    
        res.json({
            message: "Compra generada",
            ticket: {
                id: ticket._id,
                amount: ticket.amount,
                purchaser: ticket.purchaser
            }, 
            productosNoDisponibles
        })

    } catch (error) {
        res.status(500).send("error al buscar carrito");
    }
})

export default router;
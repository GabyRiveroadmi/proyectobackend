import express from "express";
import ProductManager from "../dao/db/product-manager-db.js";
import CartManager from "../dao/db/cart-manager-db.js";

const router = express.Router();

//productos y carrito:

const productManager = new ProductManager();
const cartManager = new CartManager();


router.get("/products", async (req, res) => {
   try {
      const { page = 1, limit = 2 } = req.query;
      const productos = await productManager.getProducts({
         page: parseInt(page),
         limit: parseInt(limit)
      });

      const nuevoArray = productos.docs.map(producto => {
         const { _id, ...rest } = producto.toObject();
         return rest;
      });

      res.render("products", {
         productos: nuevoArray,
         hasPrevPage: productos.hasPrevPage,
         hasNextPage: productos.hasNextPage,
         prevPage: productos.prevPage,
         nextPage: productos.nextPage,
         currentPage: productos.page,
         totalPages: productos.totalPages
      });

   } catch (error) {
      console.error("Error al obtener productos", error);
      res.status(500).json({
         status: 'error',
         error: "Error interno del servidor"
      });
   }
});

router.get("/carts/:cid", async (req, res) => {
   const cartId = req.params.cid;

   try {
      const carrito = await cartManager.getCarritoById(cartId);

      if (!carrito) {
         console.log("No existe ese carrito con el id");
         return res.status(404).json({ error: "Carrito no encontrado" });
      }

      const productosEnCarrito = carrito.products.map(item => ({
         product: item.product.toObject(),
         quantity: item.quantity
      }));


      res.render("carts", { productos: productosEnCarrito });
   } catch (error) {
      console.error("Error al obtener el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
   }
});

router.get("/product/:id", async (req, res) => {
   const productId = req.params.id;

   try {
       const producto = await productManager.getProductById(productId);

       if (!producto) {
           console.log("No existe ese producto con el id");
           return res.status(404).render("error", { error: "Producto no encontrado" });
       }

       res.render("product", { producto });
   } catch (error) {
       console.error("Error al obtener el producto", error);
       res.status(500).render("error", { error: "Error interno del servidor" });
   }
});


//rutas usuario:
router.get("/login", (req, res) => {
   if(req.session.login) {
       return res.redirect("/login"); 
   }
   res.render("login");
})

router.get("/register", (req, res) => {
   if(req.session.login) {
       return res.redirect("/register"); 
   }
   res.render("register");

})

router.get("/profile", (req, res) => {
   if(!req.session.login) {
       return res.redirect("/login"); 
   }
   res.render("profile", {user: req.session.user});
})

router.get("/products", (req, res) => {
   res.render("products", {user: req.session.user});
})


export default router;
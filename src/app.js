import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/routes.product.js";
import cartsRouter from "./routes/routes.cart.js";
import viewsRouter from "./routes/views.router.js";

const app = express();
const PUERTO = 8080;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public")); 


app.engine("handlebars", engine()); 
app.set("view engine", "handlebars"); 
app.set("views", "./src/views"); 

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

import ProductManager from "./controllers/product-manager.js";
const productManager = new ProductManager("./src/fs/productos.json");

const io = new Server(httpServer); 


io.on("connection", async (socket) => {
console.log("Un cliente se conecto"); 
 
socket.emit("productos", await productManager.getProducts());
 
socket.on("eliminarProducto", async (id) => {
  await productManager.deleteProduct(id);
 
io.sockets.emit("productos", await productManager.getProducts());
    })

socket.on("agregarProducto", async (producto) => {
  await productManager.addProduct(producto); 

  io.sockets.emit("productos", await productManager.getProducts());
    })
})
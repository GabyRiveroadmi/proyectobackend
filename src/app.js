import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/routes.product.js";
import cartsRouter from "./routes/routes.cart.js";
import viewsRouter from "./routes/views.router.js";
import "./database.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import "./database.js";
import sessionRouter from "./routes/session.routes.js";

const app = express();
const PUERTO = 8080;
const claveSecreta = "MiProyecto1";
const fileStore = FileStore(session);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(cookieParser(claveSecreta));
app.use(session({
    secret: "claveSecreta2",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://gabyriveroadmi1:Coder1234@cluster0.rrpbegd.mongodb.net/login?retryWrites=true&w=majority&appName=Cluster0"
    })
}));


app.engine("handlebars", engine()); 
app.set("view engine", "handlebars"); 
app.set("views", "./src/views"); 


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", sessionRouter);


const httpServer = app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

import ProductManager from "./dao/fs/product-manager.js";
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
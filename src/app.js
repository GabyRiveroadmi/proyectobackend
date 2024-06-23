import express from "express";
import displayRoutes from "express-routemap";
import product from "./routes/routes.product.js";
import cart from "./routes/routes.cart.js";
//import multer from "multer";
import exphbs from "express-handlebars";
import viewsRouter from "./routes/views.router.js";


const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./src/public"));


app.use("/api/product", product);
app.use("/api/cart", cart);
app.use("/", viewsRouter);

 
app.get("*", (req, res) => {
  res.status(404)
  res.send("Esta ruta no esta definida")
})


app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");


app.listen(PORT, () => {
  displayRoutes(app);
  console.log(`Escuchando en el puerto: ${PORT}`);})




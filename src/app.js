import express from "express";
import displayRoutes from "express-routemap";
import product from "./routes/routes.product.js";
import cart from "./routes/routes.cart.js";
import multer from "multer";


const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) =>{
  res.send("Entrega 1");})

app.use("/api/product", product);
app.use("/api/cart", cart);


 
app.get("*", (req, res) => {
  res.status(404)
  res.send("Esta ruta no esta definida")
})

app.listen(PORT, () => {
  displayRoutes(app);
  console.log(`Escuchando en el puerto: ${PORT}`);})


app.use(express.static("./src/public"));

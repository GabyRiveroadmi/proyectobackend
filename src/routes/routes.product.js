
import { Router } from "express";
import { promises as fs } from "fs";


const router = Router();


const product = [
      {
      id: 1,
      title: "Rociador Aceite Spray Aceto Cocina Condimento Pulverizador", 
      description: "Pulverizador de aceite multiusos. Diseño transparente y de doble escala",
      code: 1,
      price: 2896,
      status: true,
      stock: 10,
      category: "Cocina", 
      thumbnails: "https://dcdn.mitiendanube.com/stores/004/210/064/products/81-ca16fabcd87e937fff16862379215389-480-0-93c082f6ef2e981ab217095802747272-1024-1024.webp"
      },
      {
      id: 2,
      title: "Cuchara Silicona Mango Madera Reposteria Cocina 30cm", 
      description: "Cuchara silicona mango madera. Longitud aprox. 30 cm.Colores: Rosa, Violeta, Verde, Celeste. ",
      code: 2,
      price: 2175,
      status: true,
      stock: 5,
      category: "Cocina", 
      thumbnails: "https://dcdn.mitiendanube.com/stores/004/210/064/products/imagen_2022-08-23_1611012051-c8ddba7dfb0a88ee8a16612818902581-640-0.png"
      },
      {
      id: 3,
      title: "Infusor De Te En Hebras Acero Inoxidable", 
      description: "Infusor De Te En Hebras Acero Inoxidable",
      code: 1,
      price: 2237,
      status: true,
      stock: 8,
      category: "Cocina", 
      thumbnails: "https://dcdn.mitiendanube.com/stores/004/210/064/products/imagen_2022-08-23_1736302791-ef7ca4d4558edf1b0f16612870043544-640-0.png"
      },
      {
      id: 4,
      title: "Molde Silicona Rectangular Budinera", 
      description: "Molde 100% de silicona irrompible, higiénicos, NO fijan los olores ni el gusto, fácil de limpiar, sirve para Horno, microondas, freezer, heladera.",
      code: 1,
      price: 3950,
      status: true,
      stock: 2,
      category: "Cocina", 
      thumbnails: "https://dcdn.mitiendanube.com/stores/004/210/064/products/budi1-768bd39acf3f3e053a16612824209231-640-0.png"
      }
      
    ];


  const archivoProductos = ("./src/fs/productos.json");

  const guardarArchivo = async (array) => {
      await fs.writeFile(archivoProductos, JSON.stringify(array, null, 2));}
  
  guardarArchivo(product);
  
  const leerArchivos = async () => {
    const respuesta = await fs.readFile(archivoProductos, "utf-8");
    const arrayNuevoProducto = JSON.parse(respuesta);
    console.log(arrayNuevoProducto);}

leerArchivos();




// GET: lista los productos de la base con limite de productos:
    
    router.get("/", (req, res) => {

      const limit = parseInt(req.query.limit) || 5;
      const limitedProducts = product.slice(0, limit);
    
      res.json({ mensaje: "Sección con 5 productos", productos: limitedProducts });
    });


// GET: trae sólo el producto con el id proporcionado:


router.get("/:pid", (req, res) => {
  const id = parseInt(req.params.pid);
  const productFound = product.find(p => p.id === id);

  if (productFound) {
    res.json(productFound);
  } else {
    res.status(404).json({ error: "El id no existe" });
  }
});



//POST: agrega un nuevo producto con los todos los campos con id correlativo:   

router.post("/", (req,res) => { 
  const title = req.body.title
  const description = req.body.description
  const code = req.body.code
  const price = req.body.price
  const status = req.body.status
  const stock = req.body.stock
  const category = req.body.category
  
  if(!title || !description || !code || !price || !status || !stock || !category) {
  res.status(400).json({ error: "Todos los campos son obligatorios"});
  return}
  
  let id = product[product.length -1].id + 1


  product.push({ id, title, description, code, price, status, stock, category })
  res.send({status:"success",message:"Producto creado exitoso"})
})


//PUT: toma un id de producto y actualiza:

router.put("/:pid", (req, res) => {
  const id = parseInt(req.params.pid);
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;

  const productIndex = product.findIndex(p => p.id === id);

  if (productIndex !== -1) {
    const updatedProduct = { ...product[productIndex], title, description, code, price, status, stock, category, thumbnails };
    product[productIndex] = updatedProduct;

    res.json({
      message: "Producto actualizado con éxito",
      response: updatedProduct
    });
  } else {
    res.status(404).json({ error: "El producto no existe" });
  }
});


//DELETE: elimina el producto con el id indicado:

router.delete("/:pid", (req, res) => {
  const id = parseInt(req.params.pid);
  
  const productIndex = product.findIndex(p => p.id === id);

  if (productIndex !== -1) {
    product.splice(productIndex, 1);
    res.send({ status: "success", message: "Producto eliminado correctamente" });
  } else {
    res.status(404).json({ error: "El producto no existe" });
  }
});


leerArchivos();


export default router
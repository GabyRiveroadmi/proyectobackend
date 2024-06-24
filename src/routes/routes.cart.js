import { Router } from "express";
import { promises as fs } from "fs";

const router = Router();

const cart = [
  {
    "id": 1,
    "products": [
      { "product": "1", "quantity": 2 },
      { "product": "2", "quantity": 4 },
      { "product": "3", "quantity": 4 }
    ]
  },
  {
    "id": 2,
    "products": [
      { "product": "1", "quantity": 2 },
      { "product": "2", "quantity": 3 },
      { "product": "3", "quantity": 1 }
    ]
  },
  {
    "id": 3,
    "products": [
      { "product": "1", "quantity": 5 },
      { "product": "2", "quantity": 8 },
      { "product": "3", "quantity": 2 }
    ]
  },
  {
    "id": 4,
    "products": [
      { "product": "1", "quantity": 1 },
      { "product": "2", "quantity": 1 },
      { "product": "3", "quantity": 1 }
    ]
  },
  {
    "id": 5,
    "products": [
      { "product": "1", "quantity": 2 },
      { "product": "2", "quantity": 2 },
      { "product": "3", "quantity": 2 }
    ]
  }
];

const archivoCarrito = "./src/fs/carrito.json";

const guardarArchivo = async (array) => {
  try {
    await fs.writeFile(archivoCarrito, JSON.stringify(array, null, 2));
    console.log("Archivo de carrito actualizado");
  } catch (error) {
    console.error("Error al guardar el archivo de carrito:", error);
  }
};


const inicializarArchivo = async () => {
  try {
    await fs.access(archivoCarrito);
  } catch (error) {
    await guardarArchivo(cart);
  }
};

inicializarArchivo();

const leerArchivos = async () => {
  try {
    const respuesta = await fs.readFile(archivoCarrito, "utf-8");
    const arrayNuevoCarrito = JSON.parse(respuesta);
    console.log("Contenido del archivo de carrito:", arrayNuevoCarrito);
  } catch (error) {
    console.error("Error al leer el archivo de carrito:", error);
  }
};

leerArchivos();

// Listar todos los carritos

router.get("/", (req, res) => {
  try {
    res.status(200).json({ status: "success", carritos: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al obtener los carritos" });
  }
});

// Crear un nuevo carrito

router.post("/", (req, res) => {
  const nuevoCarrito = req.body;

  try {
    const lastId = cart.length > 0 ? cart[cart.length - 1].id : 0;
    nuevoCarrito.id = lastId + 1;

    cart.push(nuevoCarrito);
    guardarArchivo(cart);
    res.status(201).send({ message: "Carrito creado exitosamente" });

  } catch (error) {
    res.status(500).send({ message: "Error al crear el carrito" });
  }
});

// Listar el carrito de un id determinado

router.get("/:pid", (req, res) => {
  const id = parseInt(req.params.pid);
  const cartFound = cart.find(c => c.id === id);

  if (cartFound) {
    res.json(cartFound);
  } else {
    res.status(404).json({ error: "El id no existe" });
  }
});

// Agregar un producto y cantidad al carrito seleccionado

router.post("/:cid/product/:pid", (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
    const cartFound = cart.find(c => c.id === cartId);

    if (!cartFound) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productIndex = cartFound.products.findIndex(p => p.product === productId);

    if (productIndex !== -1) {
      cartFound.products[productIndex].quantity += quantity;
    } else {
      cartFound.products.push({ product: productId, quantity: quantity });
    }

    guardarArchivo(cart);
    res.json(cartFound.products);
  } catch (error) {
    res.status(500).send({ status: "error", message: "Error al agregar producto al carrito" });
  }
});

export default router;

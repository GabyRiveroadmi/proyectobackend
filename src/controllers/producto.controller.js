import {productoService} from "../services/producto.service.js"; 


class ProductoController {
    async getProductos(req, res) {
        try {
            const productos = await productoService.obtenerProductos();
            res.json(productos);

        } catch (error) {
            res.send("Error interno del servidor en producto.controller");

        }
    }

    async postProducto(req, res) {
        try {
            const producto = await productoService.crearProducto(req.body);
            res.json(producto);
        } catch (error) {
            res.send("Error interno del servidor en producto.controller");
        }
    }
}

export default ProductoController;
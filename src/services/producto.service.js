import ProductoRepository from "../repository/ProductoRepository.js";
import DAO from "../dao/factory.js"; 

class ProductoService {
    constructor(productoRepository) {
        this.productoRepository = productoRepository; 
    }

    async obtenerProductos(){
        return await this.productoRepository.obtenerProductos(); 
    }

    async crearProducto(producto) {
        return await this.productoRepository.crearProducto(producto)
    }
}

export const productoService = new ProductoService( new ProductoRepository(DAO)); 
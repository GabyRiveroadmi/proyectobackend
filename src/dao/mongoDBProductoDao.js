import ProductoModel from "./fs/data/product.model.js";

class MongoDBProductoDAO {

    async crearProducto(datosProducto){
        try {
            const producto = new ProductoModel(datosProducto); 
            return await producto.save(); 
        } catch (error) {
            throw new Error("Error al crear el producto en MongoDB");
        }
    }

    async obtenerProductos(){
        try {
            console.log("Llega la info");
            return await ProductoModel.find(); 
        } catch (error) {
            throw new Error("Error al obtener los productos desde MongoDB");
        }

    }

}

export default MongoDBProductoDAO;
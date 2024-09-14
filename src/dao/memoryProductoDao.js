class MemoryProductoDAO {
    constructor() {
        this.productos = []
    }

    async crearProducto(datosProducto){
        try {
            this.productos.push(datosProducto);
            return datosProducto; 
        } catch (error) {
            throw new Error("Error al crear un producto en Memoria"); 
        }
    }

    async obtenerProductos(){
        try {
            return this.productos; 
        } catch (error) {
            throw new Error("Error al obtener los productos de Memoria");
        }
    }

}

export default MemoryProductoDAO; 
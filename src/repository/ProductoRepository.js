class ProductoRepository {
    constructor(dao) {
        this.dao = dao; 
    }

    async crearProducto() {
        return this.dao.crearProducto()
    }

    async obtenerProductos(producto) {
        return this.dao.obtenerProductos(producto); 
    }

}

export default ProductoRepository; 
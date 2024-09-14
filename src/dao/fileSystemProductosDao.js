import fs from "fs";

class FileSystemProductosDAO {
    async crearProductos(datosProducto) {
        try {
          
            const productos = await this.leerArchivo(); 

            productos.push(datosProducto);

            await this.escribirProductos(productos);
            return datosProducto; 
            
        } catch (error) {
            throw new Error("Error al crear un producto en archivo"); 
        }

    }

    async obtenerProductos() {
        try { 
            const productos = await this.leerArchivo(); 
            return productos; 
        } catch (error) {
            throw new Error("Error al obtener pruductos del archivo"); 
        }

    }


    async leerArchivo() {
        try {
            const data = await fs.promises.readFile("./src/fs/productos.json");
            return JSON.parse(data); 
        } catch (error) {
            throw new Error("Error al leer el archivo de productos"); 
        }

    }

    async escribirArchivo(data) {
        try {
            await fs.promises.writeFile("./src/fs/productos.json", JSON.stringify(data, null, 2));
        } catch (error) {
            throw new Error("Error al escribir el archivo de productos"); 
        }

    }
}

export default FileSystemProductosDAO;
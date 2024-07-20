import CartModel from "../fs/data/cart.model.js";

class CartManager {
    async getCarritos() {
        try {
            const carritos = await CartModel.find();
            return carritos;
        } catch (error) {
            console.error("Error al obtener los carritos", error);
            throw error;
        }
    }

    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({ products: [] });
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.log("Error al crear carrito", error);
            throw error;
        }
    }

    async getCarritoById(cartId) {
        try {
            const carrito = await CartModel.findById(cartId);

            if (!carrito) {
                throw new Error(`No existe un carrito con el id ${cartId}`);
            }
            return carrito;
        } catch (error) {
            console.error("Error al obtener el carrito por ID", error);
            throw error;
        }
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(cartId);
            const existeProducto = carrito.products.find(item => item.product.toString() === productId);

            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ product: productId, quantity });
            }

            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            console.error("Error al agregar producto al carrito", error);
            throw error;
        }
    }

    async eliminarProductoDelCarrito(cartId, productId) {
        try {
            const carrito = await this.getCarritoById(cartId);
            carrito.products = carrito.products.filter(item => item.product.toString() !== productId);

            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            console.error("Error al eliminar producto del carrito", error);
            throw error;
        }
    }

    async eliminarTodosLosProductosDelCarrito(cartId) {
        try {
            const carrito = await this.getCarritoById(cartId);
            carrito.products = [];

            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            console.error("Error al eliminar todos los productos del carrito", error);
            throw error;
        }
    }
}

export default CartManager;

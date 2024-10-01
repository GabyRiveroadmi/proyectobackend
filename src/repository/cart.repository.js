import CartDao from "../dao/cart.dao.js";

class CartRepository {

    // crear carrito
    async createcart() {
        return await CartDao.create();
    }

     // carrito por ID
     async getCartById(cartId) {
        return await CartDao.findById(cartId);
    }

    // Agregar un producto al carrito
    async addProductToCart(cartId, productId, quantity) {
        const cart = await CartDao.findById(cartId);
        if (cart) {
            const productIndex = cart.products.findIndex(p => p.productId == productId);
            if (productIndex > -1) {
                // Si el producto ya existe, actualizar cantidad
                cart.products[productIndex].quantity += quantity;
            } else {
                // Si no existe, agregar
                cart.products.push({ productId, quantity });
            }
            return await cart.save();
        }
        throw new Error('Carrito no encontrado para agregar productos');
    }

    // Eliminar un producto del carrito
    async removeProductFromCart(cartId, productId) {
        const cart = await CartDao.findById(cartId);
        if (cart) {
            cart.products = cart.products.filter(p => p.productId != productId);
            return await cart.save();
        }
        throw new Error('Carrito no encontrado para eliminar');
    }

    // Actualizar cantidad de un producto en el carrito
    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await CartDao.findById(cartId);
        if (cart) {
            const productIndex = cart.products.findIndex(p => p.productId == productId);
            if (productIndex > -1) {
                cart.products[productIndex].quantity = quantity;
                return await cart.save();
            }
            throw new Error('Producto no encontrado en el carrito');
        }
        throw new Error('Carrito no encontrado para actualizar');
    }

    // Vaciar carrito
    async clearCart(cartId) {
        const cart = await CartDao.findById(cartId);
        if (cart) {
            cart.products = [];
            return await cart.save();
        }
        throw new Error('Carrito no encontrado para vaciar');
    }

    async deleteCart(cartId) {
        return await CartDao.findByIdAndDelete(cartId);
    }
}

export default new CartRepository();
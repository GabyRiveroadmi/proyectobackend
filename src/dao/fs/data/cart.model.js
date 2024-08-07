import mongoose from "mongoose";
import { paginate } from "mongoose-paginate-v2";

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
});

cartSchema.pre('findOne', function (next) {
    this.populate('products.product', '_id title price');
    next();
  });


const CartModel= mongoose.model("Carts", cartSchema);

export default CartModel;
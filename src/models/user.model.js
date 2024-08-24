import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    //cart: {type: Number,required: true},

    rol: {
        type: String,
        enum: [ "admin", "usuario"],
        default: "usuario"
        
    }
})

const UsuarioModel = mongoose.model("usuario", usuarioSchema); 

export default UsuarioModel; 
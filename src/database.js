import mongoose from "mongoose";

mongoose.connect("mongodb+srv://gabyriveroadmi1:Coder1234@cluster0.rrpbegd.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
 .then( () => console.log("Conexion mongoose ok"))
 .catch( (error) => console.log("Error"))
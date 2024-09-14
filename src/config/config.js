import dotenv from "dotenv"; 
import program from "../util/commander.js"; 


const {mode} = program.opts(); 
dotenv.config({
    path: mode === "desarrollo"?"./.env.desarrollo":"./.env.produccion"
}); 


const configObject = {
    PUERTO: process.env.PUERTO, 
    MONGO_URL: process.env.MONGO_URL,
    persistence: process.env.PERSISTENCE || "memory"
}

export default configObject; 
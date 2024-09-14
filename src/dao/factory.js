import config from "../config/config.js";
import MemoryProductoDAO from "./memoryProductoDao.js";
import MongoDBProductoDAO from "./mongoDBProductoDao.js";
import FileSystemProductosDAO from "./fileSystemProductosDao.js";

let DAO; 

switch(config.persistence) {
    case "mongo":
        DAO = new MongoDBProductoDAO();
        break;
    case "memory":
        DAO = new MemoryProductoDAO();
        break; 
    case "file":
        DAO = new FileSystemProductosDAO();
        break;
    default: 
        throw new Error("Persistencia no valida"); 
}

export default DAO; 
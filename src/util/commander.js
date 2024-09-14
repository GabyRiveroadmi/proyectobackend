import { Command } from "commander";
const program = new Command(); 

program
    .option("-p <port>", "Puerto en donde se inicia el servidor", 8080)
    .option("--mode <mode>", "modo de trabajo", "produccion")
program.parse(); 

//Para verificar las opciones ya configuradas: 
console.log("Opciones : ", program.opts()); 

export default program; 
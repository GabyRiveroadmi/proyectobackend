import express from "express";
import session from "express-session";
//import router from "./routes.product";
import { Router } from "express";
import UserModel from "../models/user.model.js";


const router = Router(); 

//register:

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;

    try {
        const existeUser = await UserModel.findOne({email: email}); 

        if(existeUser) {
            return res.status(400).send("El correo electronico ya esta registrado"); 
        }
        const nuevoUser = await UserModel.create({first_name, last_name, email, password, age}); 

        req.session.user = {...nuevoUser._doc}; 

        res.status(200).send("Usuario creado con exito"); 
        
    } catch (error) {
        res.status(500).send("Error al registarse"); 
    }
})

//login : 

router.post("/login", async (req, res) => {
    const {email, password} = req.body; 

    try {
        const usuario = await UserModel.findOne({email:email}); 

        if(usuario) {
            if (usuario.password === password) {
                req.session.user = {
                    email: usuario.email, 
                    age: usuario.age, 
                    first_name: usuario.first_name, 
                    last_name: usuario.last_name
                }
                res.redirect("/profile"); 
            } else {
                res.status(401).send("Password incorrecto"); 
            }
        } else {
            res.status(404).send("Usuario no encontrado"); 
        }
    } catch (error) {
        res.status(500).send("Error de login"); 
    }
})



router.get("/session", (req, res) =>{
   if(req.session.counter) {
    req.session.counter++;
    res.send("Visitaste este sitio: " +req.session.counter);
   } else {
     req.session.counter = 1;
     res.send("Bienvenido");
   }
})

router.get("/logout", (req, res) => {
req.session.destroy( (error) => {
if(!error) res.send("Sesion cerrada ok");
else res.send("Existe un error")})}) 



router.get("/login", (req, res) =>{
    let {usuario, pass} = req.query;

    if(usuario === "usuario1" && pass === "pass1234") {
        req.session.user = usuario;
        res.send("Inicio se sesion exitoso"); 
    } else {
        res.send("Datos incorrectos");
    }
})

function auth (req, res, next) {
    if(req.session.user === "admi" && req.session.admin === true) {
        return next();
    }
    return res.status(403).send("Error de autorizacion");
}

router.get("/privado", auth, (req, res) =>{
    res.send("Logueado en el sistema");

})

export default router;
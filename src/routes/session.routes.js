import { Router } from "express";
const router = Router();
import UsuarioModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../util/hashbcrypt.js";
import passport from "passport";
import jwt from "jsonwebtoken";

//register: 

router.post("/register", passport.authenticate("register", {
    failureRedirect: "/failedregister"
    }),
    async (req, res) => {
    const { usuario, password, first_name, last_name, email, age } = req.body;

    try{
        const existeUsuario = await UsuarioModel.findOne({ usuario });

        if (existeUsuario) {
            return res.status(400).send("El usuario ya existe");
        }
        
        const nuevoUsuario = new UsuarioModel({
            usuario,
            password: createHash(password), 
            first_name,
            last_name,
            email,
            age
        })

       
        await nuevoUsuario.save();

        
        const token = jwt.sign(
            { usuario: nuevoUsuario.usuario, rol: nuevoUsuario.rol }, 
            "MiProyecto1", 
            { expiresIn: "12h" }
        );

      
        res.cookie("coderCookieToken", token, {
            maxAge: 3600000, 
            httpOnly: true 
        });

       
        res.redirect("/api/sessions/current");

    } catch (error) {
       
        console.log(error); 
        res.status(500).send("Error de registro, verifique datos ingresados");
    }
});

//Login

router.post("/login", async (req, res) => {
    const { usuario, password } = req.body;

    try {
         
        const usuarioEncontrado = await UsuarioModel.findOne({ usuario });

        
        if (!usuarioEncontrado) {
            return res.status(401).send("Usuario no valido");
        }

        if (!isValidPassword(password, usuarioEncontrado)) {
            return res.status(401).send("Contraseña incorrecta");
        }

        const token = jwt.sign({ usuario: usuarioEncontrado.usuario, rol: usuarioEncontrado.rol }, "MiProyecto1", { expiresIn: "1h" });

        res.cookie("coderCookieToken", token, {
            maxAge: 3600000, 
            httpOnly: true  
        })

        res.redirect("/api/sessions/current");


    } catch (error) {
        res.status(500).send("Error interno, no es posible loguearse");
    }
})


//ruta current: 

router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (req.user) {
        res.render("home", { usuario: req.user.usuario });
    } else { 
        res.status(401).send("No autorizado");
    }
})

//logout

router.post("/logout", (req, res) => {
    
    res.clearCookie("coderCookieToken");
    res.redirect("/login"); 
})


//Ruta admins: 

router.get("/admin", passport.authenticate("jwt", {session:false}), (req, res) => {
    if(req.user.rol !== "admin") {
        return res.status(403).send("Acceso denegado, solo para admininstradores"); 
    } 
    res.render("admin"); 
})

export default router; 
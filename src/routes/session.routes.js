import { Router } from "express";
import UsuarioModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../util/hashbcrypt.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();

//register: 

router.post("/register", async (req, res) => {
    const { email, password, first_name, last_name, age } = req.body;

    try {
        const existeUsuario = await UsuarioModel.findOne({ email });

        if (existeUsuario) {
            return res.status(400).send("El usuario ya existe");
        }

        const nuevoUsuario = new UsuarioModel({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password)
        });

        await nuevoUsuario.save();

        const token = jwt.sign(
            { email: nuevoUsuario.email, rol: nuevoUsuario.rol, first_name: nuevoUsuario.first_name, last_name: nuevoUsuario.last_name }, 
            process.env.JWT_SECRET || "MiProyecto1", 
            { expiresIn: "1h" }
        );
      
        res.cookie("coderCookieToken", token, {
            maxAge: 3600000, 
            httpOnly: true
        });

        res.redirect("/api/sessions/current");
    } catch (error) {
        res.status(500).send("Error de registro, verifique datos ingresados");
    }
});

// Ruta de inicio de sesión
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuarioEncontrado = await UsuarioModel.findOne({ email });

        if (!usuarioEncontrado) {
            return res.status(401).send("Usuario no válido");
        }

        if (!isValidPassword(password, usuarioEncontrado)) {
            return res.status(401).send("Contraseña incorrecta");
        }

        const token = jwt.sign(
            { email: usuarioEncontrado.email, rol: usuarioEncontrado.rol, first_name: usuarioEncontrado.first_name, last_name: usuarioEncontrado.last_name }, 
            process.env.JWT_SECRET || "MiProyecto1", 
            { expiresIn: "1h" }
        );

        res.cookie("coderCookieToken", token, {
            maxAge: 3600000, 
            httpOnly: true 
        });

        res.redirect("/api/sessions/current");
    } catch (error) {
        res.status(500).send("Error interno, no es posible ingresar");
    }
});

// Ruta current
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (req.user) {
        res.render("home", { usuario: req.user.first_name }); // Cambiado a first_name
    } else {
        res.status(401).send("No autorizado");
    }
});

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
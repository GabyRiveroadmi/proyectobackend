import { Router } from "express";
import passport from "passport";
import userController from '../controllers/user.controller.js';


const router = Router();

router.post('/register',userController.register);
router.post('/login', userController.login);
router.get('/current', passport.authenticate('jwt', { session: false }), userController.current);
router.post('/logout', userController.logout);


//Ruta admins: 

router.get("/admin", passport.authenticate("jwt", {session:false}), (req, res) => {
    if(req.user.rol !== "admin") {
        return res.status(403).send("Acceso denegado, solo para admininstradores"); 
    } 
    res.render("admin"); 
})

export default router; 
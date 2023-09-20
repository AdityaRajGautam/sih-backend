import express from 'express'
import { forgotPasswordController, loginController, registercontroller, updateProfileController } from "../controllers/userController.js"
import { isAdmin, requireSignIn } from '../middlewares/authenticationMiddleware.js'

const router=express.Router()


//Routing 
//Register  -- method POST
router.post('./register',registercontroller)

//Login || POST
router.post('./login',loginController)

//Forgot Password || POST
router.post('/frogot-password',forgotPasswordController)

//protected user route auth
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
  });

//protected admin route auth
router.get("/admin-auth", requireSignIn,isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});
  
//update profile
router.put("/profile", requireSignIn, updateProfileController);


export default router
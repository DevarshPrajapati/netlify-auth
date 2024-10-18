import authController from "../controller/auth";
import express, { Router } from "express";
import verifyAdminAuth from "../../middleware/adminAuth";
import upload_image from "../../utils/multer";

const authRouter:Router = express.Router();


authRouter.post('/login',authController.login)
authRouter.post('/register',upload_image.single('image'),authController.register)
authRouter.post('/edituser',verifyAdminAuth,authController.editUser)
authRouter.post('/changepassword',verifyAdminAuth,authController.changePassword)
authRouter.get('/logout',verifyAdminAuth,authController.logout)





export default authRouter
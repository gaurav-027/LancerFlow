import {Router} from "express";
import {getme,login,logout,register,requestEmailVerification,resetPassword,updateUser,verifyEmail} from "../controllers/userController.js";
import { authuser } from "../Middleware.js";

const authRoute = Router();

authRoute.route('/login').post(login);
authRoute.route('/register').post(register);
authRoute.route('/logout').get(logout);
authRoute.route('/getme').get(authuser , getme);
authRoute.route('/update').put(authuser , updateUser);
authRoute.route('/reset-password').put(authuser , resetPassword);
authRoute.route('/verify-email/request').post(authuser , requestEmailVerification);
authRoute.route('/verify-email').post(authuser , verifyEmail);

export default authRoute

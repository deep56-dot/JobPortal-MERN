import { User } from "../models/user.model.js";
import { AsyncHandler } from "./AsyncHandler.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken"

export const isAuthenticated = AsyncHandler(async(req,res,next)=>{
    
    const { token } = req.cookies;
    if (!token) {
      return next(new ErrorHandler("User is not authenticated.", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
    req.user = await User.findById(decoded.id);
  
    next();
})
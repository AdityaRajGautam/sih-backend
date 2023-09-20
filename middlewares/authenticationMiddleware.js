import JWT from 'jsonwebtoken';
import User from '../models/user.js';

//Protected Routes from token base
export const requireSignIn=async(req,res,next)=>{
    try{
    const decode=JWT.verify(
        req.headers.authorization,
        process.env.JWT_SECERT
    );
    req.user=decode; 
    next();
    }
    catch(error){
        console.log(error);
    }
};


//admin access
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== "admin") {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } 
  catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Something went wrong",
    });
  }
};
    
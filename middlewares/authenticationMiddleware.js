import jwt from 'jsonwebtoken';
import agency from '../models/agency.js';


// Authenticating Agency using Bearer token
export const requireSignIn = async(req, res, next) => {
  let token;
  if (
      // Checking if user is loggedin by checking for JWT token sent by client
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
  ){
      try {
          // Saving Token
          token = req.headers.authorization.split(" ")[1];

          // Decoding JWT
          const decoded = jwt.verify(token, 'NSHMAS8860125708');
          console.log(decoded);
          req.user = await agency.findById(decoded.id).select("-password");
          next();
      } catch (error) {
          res.status(401).json({success:false,error});
      }
  }
  if (!token) {
      res.status(401);
      throw new Error("Note authorised, couldn't find token");
  }
};
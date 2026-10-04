

 const jwt  = require("jsonwebtoken");
 const dotenv = require('dotenv');

dotenv.config();
   const authenticateToken = (req,res,next)=>{

    const authHeader = req.headers.authorization;
  
    
      const token = authHeader && authHeader.split(" ")[1];//split the string and get the  token from it
   
    

    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{

      if(err){
        return res.status(403).json({
            message:"invalid or expired token"
        })
      }
        req.userId = decoded.userId;
        
        next();


       
    });

   }

   module.exports = authenticateToken;


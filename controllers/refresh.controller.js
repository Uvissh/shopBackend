
const jwt = require('jsonwebtoken')
const refreshController = async(req,res,next)=>{
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(401).json({
                message:"refresh token not found"
            })
        }
        let  decoded;
         try{
            decoded = jwt.verify(refreshToken,process.env. REFRESH_JWT_SECRET);

         }catch(err){
            return res.status(401).json({
                message:"invalid or expired refresh token"
            });
         }
         const accessToken = jwt.sign({userId:decoded.userId},process.env.JWT_SECRET,{expiresIn:"15m"})
         return res.status(200).json({
            token :accessToken
         })

    }catch(err){
        next(err);
    }
} 

module.exports = refreshController
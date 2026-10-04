const dotenv = require('dotenv');

dotenv.config();

const errorHandler = (err,req,res, next)=>{

    console.log(err.stack);

 
    res.status(err.statusCode||500).json({
        sucess:false,
        message:err.message||"internal Server Error",
        stack :process.env.NODE_ENV ==='production'?null:err.stack
    });
}
module.exports = errorHandler;
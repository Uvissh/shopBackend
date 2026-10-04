const  bcrypt = require('bcrypt')
const pool = require('../db');
const jwt = require('jsonwebtoken')
const  register = async(req,res,next)=>{
    const {email,password,name} = req.body;
    if(!email||!password||!name){
        return res.status(400).json({
            message:"email ,name and  password are required"
        })
    }

    try{
        const saltRounds  = 10;
        const passwordHash = await  bcrypt.hash(password,saltRounds);
        const result = await pool.query(`INSERT into users(name,email,password) values($1,$2,$3)  returning *`,[name,email,passwordHash]);
        if(result.rows.length == 0){
            return res.status(404).json({
                message:"error "
            })

        }

        return res.status(201).json({
            message:"user register successfully"
        })

        


    }catch(err){
        next(err);
    }
}

const login = async(req,res,next)=>{
    try{

const {email,password} = req.body;

if(!email || !password){
    return res.status(400).json({
        message:"email and password are required"
    })
}


    const result = await  pool.query(`select  id,name,email,password from users  where email= $1 `,[email]);
    if(result.rows.length === 0){
        return res.status(404).json({
            message:"data not found"
        })
    }
    
    const user = result.rows[0];
    const validUser  = await bcrypt.compare(password,user.password);
    if(!validUser){
        return res.status(401).json({
            message:"invalid password"
        })
    }

    if(validUser){
    const payload = {userdId : user.id,
        
    };
    const token =  jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1h"})
    
const {password,...safeUser} = user;

return res.status(201).json({
    message:"user login successfully",
    user:safeUser,
    token:token
})
    }
    


}catch(err){
    next(err)
}
}

module.exports = {login,register};
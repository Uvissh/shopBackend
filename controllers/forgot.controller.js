const pool = require("../db");
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail')
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
sgMail.setApiKey(process.env. SEND_GRID_API_KEY)

const forgotPassword = async(req,res,next)=>{

 try{
    const {email} = req.body;

    const result = await pool.query(`select id,name,email from users where email = $1`,[email]);

    if(result.rows.length === 0){
        return res.status(404).json({
            message:"user not found"
        })
    }


const user = result.rows[0];
const resetToken = jwt.sign({userId:user.id},process.env. RESET_JWT_SECRET,{expiresIn:"10m"});
console.log(resetToken);
const expiresAt = new Date(Date.now()+10*60*1000);

await pool.query(`update users set reset_token= $1,reset_token_expires = $2 where id = $3 returning *`,[resetToken,expiresAt,user.id]);

//create reset link
const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
//send email
const message = {
    to:email,
    from:process.env.SEND_GRID_FROM_EMAIL,
    subject:"Password Reset",
    text:`Click this link to reset your password: ${resetLink}`,
    html:` <h2>Password Reset</h2>
                <p>You requested to reset your password.</p>

                <p>
                    Click the button below to reset your password:
                </p>

                <a href="${resetLink}">
                    Reset Password
                </a>

                <p>This link will expire in 10 minutes.</p>`
};
await sgMail.send(message);

 return res.status(200).json({
    message:"password reset link send to your email"
 })






    }catch(err){
        next(err);
    }}


    const resetPassword = async(req,res,next)=>{
        try{
            const{token} = req.params;
            const{newPassword} = req.body;
            if(!newPassword){
                return res.status(400).json({
                    message:"new Password is required"
                })
            }
            let decoded;
            try{
                decoded =jwt.verify(token,process.env.RESET_JWT_SECRET);

            }catch(error){
                return res.status(400).json({
                    message:"invalid or expired reset token"
                })
            }
            const result =  await pool.query(`select* from users where id = $1 and reset_token  = $2`,[decoded.userId,token]);
            if(result.rows.length === 0){
                return res.status(400).json({
                    message:"invalid reset token"
                })
            }
            const user = result.rows[0];

            //check databse token expiry
            if(!user.reset_token_expires ||new Date(user.reset_token_expires)<new Date()){
                return res.status(400).json({
                    message:"reset token has expired"
                })
            }
            const hashedPassword = await bcrypt.hash(newPassword,10);
 await pool.query(`Update users set password = $1,reset_token=NULL ,reset_token_expires=NULL where id= $2`,[hashedPassword,user.id])

 return res.status(200).json({
    message:"password reset successfully"
        })

        }catch(err){
            next(err);
        }
    }

    module.exports = {forgotPassword,resetPassword}

const {google} = require("googleapis");
const { auth } = require("googleapis/build/src/apis/abusiveexperiencereport");
const oauth2Client = require("../config/google");
const pool = require('../db')
const jwt = require("jsonwebtoken");


const googleLogin  = (req,res)=>{
    const url = oauth2Client.generateAuthUrl({
        access_type:"offline",
        scope:[
            "openid",
            "profile",
            "email"
        ]
    });

    res.redirect(url);
};


const googleCallback = async(req,res,next)=>{
    try{
        const {code} = req.query;
        const {tokens} = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({
            auth:oauth2Client,
            version:"v2"
        });
        const {data} = await oauth2.userinfo.get();
        const {
            id:googleId,
            email,
            name

        }=  data;
        const existingUser = await pool.query("select * from users where email = $1",[email]);
        let user;
        if(existingUser.rows.length >0){
            user = existingUser.rows[0];
        }
        else{
            const result = await pool.query(`insert into users (name,email,google_id) Values ($1,$2,$3) returning *`,[name,email,googleId])

            user= result.rows[0];
        }
        
        const token = jwt.sign({
            id:user.id,
            email:user.email,
            name:user.name
        },process.env.JWT_SECRET,{expiresIn:"1h"})

        res.redirect(`http://localhost:5173/google-success?token=${token}`)

    }catch(error){
        next(error)
    }
}
module.exports={googleLogin,googleCallback};
const pool = require("../db");

const  groceryController = async(req,res,next)=>{

    try{
        const userId = req.userId;
        const result =  await pool.query(`select * from  grocery order By id  `);
        return res.status(201).json({
            data:result.rows
        })


    }catch(err){
        next(err);

    }

}
module.exports = groceryController
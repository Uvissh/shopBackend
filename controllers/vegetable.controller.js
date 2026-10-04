const pool = require("../db");

const vegetableController = async(req,res,next)=>{

    try{
        const userId = req.userId;
        const result =  await pool.query(`select * from vegetables order By id  `);
        return res.status(201).json({
            data:result.rows
        })


    }catch(err){
        next(err);

    }

}
module.exports = vegetableController
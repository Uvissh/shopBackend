const pool = require("../db");

const stationaryController = async(req,res,next)=>{

    try{
        const userId = req.userId;
        const result =  await pool.query(`select * from stationery order By id  `);
        return res.status(201).json({
            data:result.rows
        })


    }catch(err){
        next(err);

    }

}
module.exports = stationaryController
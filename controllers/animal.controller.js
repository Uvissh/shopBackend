const pool = require("../db");

const animalController = async(req,res,next)=>{

    try{
        const userId = req.userId;
        const result =  await pool.query(`select * from animal_food order By id `);
        return res.status(201).json({
            data:result.rows
        })


    }catch(err){
        next(err);

    }

}
module.exports = animalController
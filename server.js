const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/error.middleware');
const app = express();
const dotenv = require('dotenv');
const userRouter = require('./Routes/user.route');
const animalRouter = require('./Routes/animal.route');
const coldRouter = require('./Routes/cold.route');
const groceryRouter = require('./Routes/grocery.route');
const statinoaryRouter = require('./Routes/statinonary.route');
const vegetableRouter = require('./Routes/vegetable.route');
const stripeRouter = require('./Routes/stripe.route');
const forgotRouter = require('./Routes/forgot.route');
const googleRouter = require('./Routes/googleAuth.route');
const refreshRouter = require('./Routes/refersh.route');
const cookieParser = require('cookie-parser');
dotenv.config();
const PORT = process.env.PORT||3000;

app.use(cors({origin:"http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(userRouter);
app.use(refreshRouter);
app.use(animalRouter);
app.use(coldRouter);
app.use(groceryRouter);
app.use(statinoaryRouter);
app.use(vegetableRouter);
app.use(stripeRouter);
app.use(forgotRouter);
app.use( "/auth",googleRouter);




app.use(errorHandler)


app.listen(PORT,()=>{
    console.log(`running in the ${PORT}`);
    
})


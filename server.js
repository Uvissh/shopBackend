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
const { stripePayment } = require('./controllers/stripe.controller');
const stripeRouter = require('./Routes/stripe.route');
const { forgotPassword } = require('./controllers/forgot.controller');
const forgotRouter = require('./Routes/forgot.route');
const googleRouter = require('./Routes/googleAuth.route');
dotenv.config();
const PORT = process.env.PORT||3000;

app.use(cors({origin:"http://localhost:5173"}));
app.use(express.json());
app.use(userRouter);
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


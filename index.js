import express  from "express";
import ConnectDB from "./config/db.js";
import dotenv from 'dotenv';
import authRoutes from './routes/userRoutes.js'

//rest object
const app = express();

//configure env
dotenv.config();

// Connect to MongoDB
ConnectDB();


//middlewares
app.use(express.json())

//routes
app.use('/api/n1/auth',authRoutes);


//rest Api  
app.get('/',(req,res)=>{
  res.send("<h1>Welecome to SIH </h1>")
})

//PORT
const PORT = process.env.PORT || 5000;

//app listen
app.listen(PORT,()=>{
  console.log(`Server is Running ${process.env.DEV_MODE} mode on port ${PORT}`);
}) 

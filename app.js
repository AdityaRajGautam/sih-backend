import express  from "express";
import authRoutes from './routes/userRoutes.js';
import disasterRoutes from './routes/disasterRoutes';
const app = express();

// Middlewares
app.use(express.json())

// Routes
app.use('/api/n1/auth',authRoutes);
app.use('/api/n1/disaster',disasterRoutes);

// Rest Api  
app.get('/',(req,res)=>{
  res.send("<h1>Welecome to SIH </h1>")
})

module.exports = app;
import express  from "express";
import agencyRoutes from './routes/agencyRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import disasterRoutes from './routes/disasterRoutes.js';
const app = express();

// Middlewares
app.use(express.json())

// Routes
app.use('/api/n1/agencyauth',agencyRoutes);
app.use('/api/n1/alertsauth',alertRoutes);
app.use('/api/n1/disasterauth',disasterRoutes);

// Rest Api  
app.get('/',(req,res)=>{
  res.send("<h1>Welecome to SIH </h1>")
})

export default app;
import express  from "express";
import agencyRoutes from './routes/agencyRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import disasterRoutes from './routes/disasterRoutes.js';
import resourecRoutes from './routes/resourceRoutes.js';

const app = express();

// Middlewares
app.use(express.json())

// Routes
app.use('/api/n1/agency',agencyRoutes);
app.use('/api/n1/alert',alertRoutes);
app.use('/api/n1/disaster',disasterRoutes);
app.use('/api/n1/resource',resourecRoutes);


// Rest Api  
app.get('/',(req,res)=>{
  res.send("<h1>Welecome to SIH </h1>")
})

export default app;
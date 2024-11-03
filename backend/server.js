const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const authRoutes = require('./routes/authRoutes')
const menuRoutes = require('./routes/menuRoutes')
const restaurantRoutes = require('./routes/restaurantRoutes')
require('dotenv').config();



const app = express();

app.use(cors());


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, DELETE, PATCH"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });
  
  
  
  // Define CORS options
  const corsOptions = {
    origin: ['http://localhost:3000'],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    optionsSuccessStatus: 204
  };
  
  // Apply CORS middleware
  app.use(cors(corsOptions));
  
  // Enable pre-flight requests for all routes
  app.options('*', cors(corsOptions));
  
  // Debugging middleware to log the origin of requests
  app.use((req, res, next) => {
    // console.log('Request Origin:', req.headers.origin);
    next();
  });


app.use(express.json());

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=>{
    console.log("Connection Established successfully..")
})
.catch((err)=>{
    console.error("Error connecting tot the database:",err);
})


app.get('/',(req,res)=>{
    res.json({message:"Hello Dev...."})
});

app.use('/api/auth',authRoutes);
app.use('/api/restaurants',restaurantRoutes);
app.use('/api/menu',menuRoutes);




const PORT = process.env.PORT || 8890;
app.listen(PORT,()=> console.log(`Server running on port ${PORT}`));
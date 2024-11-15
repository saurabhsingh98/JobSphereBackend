import dotenv from 'dotenv';
dotenv.config(); 

import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors'
import dbconnect from './utils/db.js'


const app= express();
// console.log(process.env.CLOUD_NAME)

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));


// Routing
import userRoute from './routes/user.route.js'
import companyRoute from './routes/company.route.js'
import jobRoute from './routes/job.route.js'
import applicationRoute from './routes/application.route.js'

app.use("/api/v1/user", userRoute)
app.use("/api/v1/company", companyRoute)
app.use("/api/v1/job", jobRoute)
app.use("/api/v1/application", applicationRoute)

app.listen(process.env.PORT ||3000, ()=>{

    dbconnect();

    console.log(`server running ${process.env.PORT}`)
})
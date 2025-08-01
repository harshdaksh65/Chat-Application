const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const connectToDB = require('./DB/db');
const userRoutes = require('./Routes/user.route');
const messageRoutes = require('./Routes/message.route'); 


const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));    

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './temp/'
}));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/messages', messageRoutes);

connectToDB();

module.exports = app;
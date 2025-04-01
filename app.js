require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const menuRouter = require('./controllers/menus');





(async () => {
    try {
        await mongoose.connect('mongodb+srv://madsv:RestaurantDB001@cluster0.6bir8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        console.log('Te has Conectado a MongoDB')
    } catch (error) {
        console.log(error)
    }
})()


//rutas FRONTEND
app.use('/', express.static(path.resolve('views')))


//las rutas que colocamos seran mediante express con json

app.use(express.json())
app.use(menuRouter);


//Rutes BACKEND
app.use('/api/menus', require('./controllers/menus'))



module.exports = app;
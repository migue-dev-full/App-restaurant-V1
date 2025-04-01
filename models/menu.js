const mongoose = require('mongoose')
const menuRouter = require('../controllers/menus')

// Definir el esquema del menú
const menuSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    categoria: Number
})

// Transformar el objeto devuelto por Mongoose
menuSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id

    }
})

// Crear el modelo Menu basado en el esquema
const menu = mongoose.model('menu', menuSchema)

// Exportar el modelo
module.exports = menu
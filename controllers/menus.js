//Hacer el router. El router es lo que nos va a conectar el controlador con la base de datos
//router: registrar, consultar, eliminar
//POST, GET, DELETE, UPDATE


const express = require('express')
const menuRouter = express.Router()
const fs = require('fs');
const path = require('path');


menuRouter.get('/api/menus', async (request, response) => {
    try {
        const menuData = fs.readFileSync(path.join(__dirname, '../menu.json'), 'utf8');
        console.log('Menu Data:', menuData); // Debugging line
        const listado = JSON.parse(menuData).menu;

        console.log('Response Listado:', listado); // Debugging line
        return response.status(200).json({ listado: listado });

    } catch (error) {

        console.error('Error al obtener la lista de menús:', error.message)
        return response.status(500).json({ textOk: false, error: 'Error interno del servidor' })
    }
})



module.exports = menuRouter

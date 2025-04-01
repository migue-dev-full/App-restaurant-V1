const app = require('./app')
const http = require('http')
//lo ubicamos a un puerto
const server = http.createServer(app)

server.listen(4000, () => {
    console.log('El servidor esta corriendo')
})

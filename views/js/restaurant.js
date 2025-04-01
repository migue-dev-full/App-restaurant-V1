const btnGuardarCliente = document.querySelector('#guardar-cliente')
const contenido = document.querySelector('#resumen .contenido')

//donde guardamos la informacion del  cliente 
let cliente = {
    mesa: '',
    hora: '',
    pedido: []
}

const categorias = {
    1: 'Pizzas',
    2: 'postres',
    3: 'Jugos',
    4: 'Comida',
    5: 'Cafe'
}

btnGuardarCliente.addEventListener('click', guardarCliente)

function guardarCliente() {
    const mesa = document.querySelector('#mesa').value
    const hora = document.querySelector('#hora').value
    //console.log('boton')
    //console.log(mesa,hora)

    const camposVacios = [mesa, hora].some(i => i == '')
    //console.log(camposVacios)

    if (camposVacios) {
        //si los  campos estan vacios
        //console.log('campos vacios')

        const existeAlerta = document.querySelector('.invalid')

        if (!existeAlerta) {
            const alerta = document.querySelector('div')
            alerta.classList.add('d-block', 'text-center', 'invalid')
            alerta.textContent = 'Los campos son obligatorios'
            document.querySelector('.modal-body').appendChild(alerta)

            setTimeout(() => {
                alerta.remove()
            }, 3000)
        }
    } else {
        //campos llenos
        //console.log('campos llenos')
        cliente = { ...cliente, mesa, hora }
        //console.log(cliente)
        var modalFormulario = document.querySelector('#formulario')
        var modal = bootstrap.Modal.getInstance(modalFormulario)
        modal.hide()
        const formulario = document.querySelector('form')
        formulario.reset()
        mostrarSeccion()
        obtenerMenu()
    }
}

//Obtener menu




async function obtenerMenu() {
    try {
        const response = await axios.get('/api/menus');
        const data = response.data;
        
        mostrarMenu([...data.listado]);
        //console.log(data.listado);
    } catch (error) {
        console.error('Error al obtener el menú:', error);

    }
}


function mostrarSeccion() {
    const secciones = document.querySelectorAll('.d-none')
    //console.log(secciones)
    secciones.forEach(i => i.classList.remove('d-none'))
}

function mostrarMenu(menu) {
    //console.log(menu);
    const contenido = document.querySelector('#menu .contenido')

    menu.forEach(i => {
        const fila = document.createElement('div');
        fila.classList.add('row', 'border-top');

        const nombre = document.createElement("div");
        nombre.classList.add('col-md-3', 'py-3');
        nombre.textContent = i.nombre;

        const precio = document.createElement("div");
        precio.classList.add('col-md-3', 'py-3');
        precio.textContent = i.precio;

        const categoria = document.createElement("div");
        categoria.classList.add('col-md-3', 'py-3');
        categoria.textContent = categorias[i.categoria];

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;

        inputCantidad.value = 0;
        inputCantidad.id = `producto-${i.id}` //tb podria ser i.id
        inputCantidad.onchange = function () {
            const cantidad = parseInt(inputCantidad.value);
            //console.log(cantidad);

            // toma los paraanetros actuales
            agregarOrden({ ...i, cantidad });

        }

        const agregar = document.createElement("div");
        agregar.append(inputCantidad);
        agregar.classList.add('col-md-3', 'py-3');

        fila.appendChild(nombre);
        fila.appendChild(precio);
        fila.appendChild(categoria);
        fila.appendChild(agregar);

        contenido.appendChild(fila);
    })

}

function agregarOrden(producto) {
    //extraccion del arreglo pedido que esta en cliente
    let { pedido } = cliente;

    //
    if (producto.cantidad > 0) {
        //Validar que existe
        // aumentar cantidad 
        if (pedido.some(i => i.id === producto.id)) {
            const pedidoActualizado = pedido.map(i => {
                if (i.id === producto.id) {
                    i.cantidad = producto.cantidad;
                    //console.log(producto.cantidad);
                }
                return i;
            })
            cliente.pedido = [...pedidoActualizado];
            console.log('existe', cliente);

        } else {
            // no exite
            // agregarlo a los pedidos 
            cliente.pedido = [...pedido, producto];
            console.log('no existe, agregado', cliente);
        }

    } else {
        //caso en que cantidad es 0
        //vaciar del arreglo 
        const resultado = pedido.filter(i => i.id !== producto.id)
        cliente.pedido = resultado;
        console.log('can 0', cliente);

    }

    limpiarHTML();


    if (cliente.pedido.length > 0) {
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }

}





function limpiarHTML() {
    const contenido = document.querySelector('#resumen .contenido')

    while (contenido.firstChild) {
        contenido.removeChild(contenido.firstChild);
    }
}

//todo: FALTA FUNCION ACTUALIZAR RESUMEN
function actualizarResumen() {
    const contenido = document.querySelector('#resumen .contenido');
    const resumen = document.createElement('div');

    const mesa = document.createElement('p');
    mesa.textContent = `Mesa: ${cliente.mesa}`;
    mesa.classList.add('fw-bold');

    const hora = document.createElement('p');
    hora.textContent = `Hora: ${cliente.hora}`;
    hora.classList.add('fw-bold');

    //mostrar el pedido a cliente
    const heading = document.createElement('h3');
    heading.textContent = 'pedidos';
    heading.classList.add('my-4');

    const grupo = document.createElement('ul');
    grupo.classList.add('list-group-item');

    // mostrar  los pedidos del arreglo
    const { pedido } = cliente;

    pedido.forEach(i => {
        const { nombre, precio, cantidad, id } = i;
        const lista = document.createElement('li');
        lista.classList.add('list-group-item');

        const nombreP = document.createElement('h4');
        nombreP.textContent = nombre;

        const precioP = document.createElement('p');
        precioP.textContent = `Precio: ${precio}`;

        const cantidadP = document.createElement('p');
        cantidadP.textContent = `Cantidad: ${cantidad}`;

        const subtotalValor = calcularSubtotal(i);
        const subtotalP = document.createElement('p');
        subtotalP.textContent = `Subtotal: ${subtotalValor}`;

        const btnEliminar = document.createElement("button");
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar pedido';

        btnEliminar.onclick = function () {
            eliminarProducto(id)
        }

        lista.appendChild(nombreP);
        lista.appendChild(precioP);
        lista.appendChild(cantidadP);
        lista.appendChild(subtotalP);
        lista.appendChild(btnEliminar);
        grupo.appendChild(lista);


    })

    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(heading);
    resumen.appendChild(grupo);
    contenido.appendChild(resumen);


    // mostrar calculadora de propina
    formularioPropinas()
}



function calcularSubtotal(item) {
    const { cantidad, precio } = item;
    return `$${cantidad * precio}`
}

function eliminarProducto(id) {
    const { pedido } = cliente;
    cliente.pedido = pedido.filter(i => i.id !== id)

    limpiarHTML();

    if (cliente.pedido.length != 0) {
        actualizarResumen();
    } else {
        mensajePedidoVacio();
        //console.log('pedido vacio');
    }

    // actualizar la cantidad del producto eliminado 
    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    console.log(inputEliminado);
    inputEliminado.value = 0;
}

function mensajePedidoVacio() {
    const contenido = document.querySelector('#resumen');
    const texto = document.createElement('p');
    texto.classList.add('text-center');
    texto.textContent = 'Debe agregar productos al pedido';

    contenido.appendChild(texto);
}

function formularioPropinas() {
    const contenido = document.querySelector('#resumen .contenido');
    const formulario = document.createElement('div');
    formulario.classList.add('col-md-6', 'formulario');

    const heading = document.createElement('h3');
    heading.textContent = 'propina';
    heading.classList.add('col-md-6', 'formulario')

    // propinas 5%
    const radioBox5 = document.createElement('input');
    radioBox5.type = 'radio';
    radioBox5.name = 'propina';
    radioBox5.value = '5';
    radioBox5.onclick = calcularPropina;
    radioBox5.classList.add('form-check-input')

    const radioLabel5 = document.createElement('label');
    radioLabel5.textContent = '5%';

    const radioDiv5 = document.createElement('div')
    radioDiv5.appendChild(radioBox5);
    radioDiv5.appendChild(radioLabel5);

    //* propina del 10%

    const radioBox10 = document.createElement('input');
    radioBox10.type = 'radio';
    radioBox10.name = 'propina';
    radioBox10.value = '10';
    radioBox10.onclick = calcularPropina;
    radioBox10.classList.add('form-check-input')

    const radioLabel10 = document.createElement('label');
    radioLabel10.textContent = '10%';

    const radioDiv10 = document.createElement('div')
    radioDiv10.appendChild(radioBox10);
    radioDiv10.appendChild(radioLabel10);




    formulario.appendChild(radioDiv5);
    formulario.appendChild(radioDiv10);


    contenido.appendChild(formulario);
}

function calcularPropina() {
    const radioSeleccionado = parseInt(document.querySelector('[name="propina"]:checked').value);
    console.log(radioSeleccionado);
    const formulario = document.querySelector('.formulario')

    const { pedido } = cliente;

    let subtotal = 0;
    pedido.forEach(i => {
        subtotal += i.cantidad * i.precio;
    })

    const divTotales = document.createElement('div');
    divTotales.classList.add('total-pagar');

    //propina
    const propina = subtotal * (radioSeleccionado) / 100
    const total = propina + subtotal;

    const subtotalParrafo = document.createElement('p');
    subtotalParrafo.classList.add('fs-3', 'fw-bold', 'mt-5')
    subtotalParrafo.textContent = 'Subtotal de consumo: ' //+ total;

    const subtotalP = document.createElement('p');
    subtotalP.classList.add('fs-normal');
    subtotalP.textContent = `$${subtotal}`;
    subtotalParrafo.appendChild(subtotalP);

    const propinaParrafo = document.createElement('span');
    propinaParrafo.classList.add('fs-normal');
    propinaParrafo.textContent = 'propina: ';

    const propinaP = document.createElement('span');
    propinaP.classList.add('fs-normal');
    propinaP.textContent = `$${propina}`;
    propinaParrafo.appendChild(propinaP);

    const totalParrafo = document.createElement('p');
    totalParrafo.classList.add('fs-normal');
    totalParrafo.textContent = 'Total a pagar: ';

    const totalP = document.createElement('p');
    totalP.classList.add('fs-normal');
    totalP.textContent = `$${total}`;


    totalParrafo.appendChild(totalP)
    const totalPagarDiv = document.querySelector('.total-pagar')
    if (totalPagarDiv) {
        totalPagarDiv.remove();
    }

    divTotales.appendChild(subtotalParrafo)
    divTotales.appendChild(propinaParrafo)
    divTotales.appendChild(totalParrafo)


    formulario.appendChild(divTotales)

}


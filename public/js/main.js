const socket = io.connect();

// Al agregar productos recibo el evento 'listProducts' y renderizo el listado de productos. desde el server y actualizo el template
// Para ver los cambios en la tabla
socket.on('listProducts', (data) => {
  renderProducts(data);
});

socket.on('listMensajes', (data) => {
  renderMensajes(data)
});


async function renderProducts(data) {
  const archivo = await fetch('plantillas/tabla.hbs');
  const archivoData = await archivo.text();
  const template = Handlebars.compile(archivoData);
  const result = template({ productos: data });
  document.getElementById('productos').innerHTML = result;
}

async function renderMensajes(data) {
  const archivo = await fetch('plantillas/mensajes.hbs');
  const archivoData = await archivo.text();
  const template = Handlebars.compile(archivoData);
  const result = template({ mensajes: data });
  document.getElementById('mensajes').innerHTML = result;
}


// Envio de nuevo producto, chequea que el form este completo y llama a la API
// Si todo esta bien emite el evento 'postProduct' al Websocket avisando que se agrego un producto nuevo
function addProduct(e) {
  const inputTitle = document.getElementById('title');
  const inputPrice = document.getElementById('price');
  const inputThumb = document.getElementById('thumbnail');
  if (inputTitle.value == '' || inputPrice.value == '' || inputThumb.value == '') {
    alert('Por favor complete el formulario para agregar un nuevo producto.')
  } else {
    const newProd = {
      "title": inputTitle.value,
      "price": inputPrice.value,
      "thumbnail": inputThumb.value
    };
    enviarDatos('http://localhost:8080/api/productos', newProd)
    .then(() => {
      socket.emit('postProduct');
      inputTitle.value = '';
      inputPrice.value = '';
      inputThumb.value = '';
    }).catch(error => {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
    });
  }
  return false;
}

function updateProduct(e) {
  const inputID = document.getElementById('idUp');
  const inputTitle = document.getElementById('titleUp');
  const inputPrice = document.getElementById('priceUp');
  const inputThumb = document.getElementById('thumbnailUp');
  if (inputID.value == "") {
    alert('Por favor ingresa el ID del producto a actualizar.')
  }  else if (inputTitle.value == "" && inputPrice.value == "" && inputThumb.value == "") {
    alert('Por favor seleccione algun campo para actualizar.')
  } else {
    const newProd = {};
    if (inputTitle.value != "") {
      newProd.title = inputTitle.value;
    }
    if (inputPrice.value != "") {
      newProd.price = inputPrice.value;
    }
    if (inputThumb.value != "") {
      newProd.thumbnail = inputThumb.value;
    }
    actualizarProducto(`http://localhost:8080/api/productos/actualizar/${inputID.value}`, newProd)
    .then(() => {
      socket.emit('updateProduct');
      inputTitle.value = '';
      inputPrice.value = '';
      inputThumb.value = '';
    }).catch(error => {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
    });
  }
  return false;
}

// Envio de nuevo producto, chequea que el form este completo y llama a la API
// Si todo esta bien emite el evento 'postProduct' al Websocket avisando que se agrego un producto nuevo
function deleteProduct(e) {
  const inputID = document.getElementById('id');
  if (inputID.value == '') {
    alert('Por favor complete el formulario para eliminar el producto.')
  } else {
    eliminarProducto(`http://localhost:8080/api/productos/borrar/${inputID.value}`)
    .then(() => {
      socket.emit('deleteProduct');
      inputID.value = '';
    }).catch(error => {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
    });
  }
  return false;
}

function addMensaje(e) {
  const inputUsuario = document.getElementById('usuario');
  const inputTexto = document.getElementById('texto');
  
  if (inputUsuario.value == '' || inputTexto.value == '') {
    alert('Por favor complete el formulario para enviar un mensaje.')
  } else {
    const dt = new Date();
    const fecha = `${
    (dt.getMonth()+1).toString().padStart(2, '0')}/${
    dt.getDate().toString().padStart(2, '0')}/${
    dt.getFullYear().toString().padStart(4, '0')} ${
    dt.getHours().toString().padStart(2, '0')}:${
    dt.getMinutes().toString().padStart(2, '0')}:${
    dt.getSeconds().toString().padStart(2, '0')}`;
    
    const newMensaje = { usuario: inputUsuario.value, texto: inputTexto.value, fecha };
    socket.emit('postMensaje', newMensaje);

    inputTexto.value = '';
    inputTexto.focus();
  }
  return false;
}

// Funcion para hacer el POST de datos
async function enviarDatos(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
}

// Funcion para hacer el PUT de datos
async function actualizarProducto(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
}

// Funcion para hacer el DELETE de producto
async function eliminarProducto(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'DELETE'
  });
  return response.json();
}
import express from "express";
import fetch from "node-fetch";
import handlebars from "express-handlebars";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import prodRoutes from "./routes/ProductRoutes.js";
import frontRoutes from "./routes/FrontRoutes.js";
import MensajesDB from './controllers/MensajesDB.js'
import { sqlite3 as config } from './config.js'

const mensajesDB = new MensajesDB(config);

try {
  await mensajesDB.crearTabla();
	console.log('Tabla en SQLITE3 de "Mensajes" Creada');
} catch (err) {
  console.log(err);
}

const PORT = 8080;
const app = express();

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.static("public"));

// Funcion que carga los productos y emite el llamado a "listProducts"
function getProducts() {
	fetch("http://localhost:8080/api/productos")
	.then((res) => res.json())
	.then(function (data) {
		io.sockets.emit("listProducts", data);
	});
};

// Funcion que devuelve el listado de mensajes
async function getMensajes() {
	try {
		let mensajes = await mensajesDB.listar();
		io.sockets.emit("listMensajes", mensajes);
	} catch (err) {
		console.log(err);
	}
};

async function guardarMensaje(mensaje) {
	try {
		await mensajesDB.insertar(mensaje);
	} catch (err) {
		console.log(err);
	}
}

io.on("connection", (socket) => {
	console.log("Nuevo cliente conectado!");
	getProducts();
	getMensajes();

	/* Escucho los mensajes enviado por el cliente y se los propago a todos */
	socket.on("postProduct", () => {
		getProducts();
	}).on("updateProduct", () => {
		getProducts();
	}).on("deleteProduct", () => {
		getProducts();
	}).on("postMensaje", data => {
		guardarMensaje(data);
		getMensajes();
	}).on('disconnect', () => {
		console.log('Usuario desconectado')
	});
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", frontRoutes);
app.use("/api/productos", prodRoutes);

app.engine("hbs", handlebars({
    extname: "hbs",
    defaultLayout: "layout.hbs"
  })
);

app.set("views", "./views");
app.set("view engine", "hbs");

// Conexion a server con callback avisando de conexion exitosa
httpServer.listen(PORT, () => { console.log(`Ya me conecte al puerto ${PORT}.`); })
.on("error", (error) => console.log("Hubo un error inicializando el servidor.") );

// Select, Insert, Update, Delete
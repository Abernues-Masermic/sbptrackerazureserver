// importamos las librerías requeridas
const path = require("path");
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT | 8080;
const server = require('http').Server(app);
const WebSocketServer = require("websocket").server;

let constants = require('./public/js/constants');



// Creamos el servidor de sockets y lo incorporamos al servidor de la aplicación
const wss = new WebSocketServer({
    port: PORT,
    httpServer: server,
    autoAcceptConnections: false,
});

console.log('Websocket server listenning port: ' + wss.config.port);

// Especificamos el puerto en una varibale port, incorporamos cors, express 
// y la ruta a los archivo estáticos (la carpeta public)
app.set("port", PORT);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(cors());
app.use('/', express.static(__dirname + './public'));
app.use(express.json());
app.use('/static', express.static(path.join(process.cwd(), "public")));

app.get('/', function (req, res)
{
    const serverData = { saludo_servidor: 'Hello from the server!' }; 
    res.render(path.join(__dirname, '/public', 'index.html'), serverData);
});

//



function originIsAllowed(origin) {
    //if(origin === "http://localhost:"+ WEB_SOCKET){
    //   return true;
    //}
    return true;
}

wss.on("request", (request) =>{
    if (!originIsAllowed(request.origin)) {
        request.reject();
        console.log((new Date()) + ' Conexión del origen ' + request.origin + ' rechazada.');
        return;
    }

    console.log("Nuevo client conectado");

    const connection = request.accept(null, request.origin);
    connection.on("message", (message) => {
        console.log("Mensaje recibido: " + message.utf8Data);

        try{
            var message_json = JSON.parse( message.utf8Data );
            if (message_json.messagetype === constants.MESSAGE_TYPE_REQUEST)
            {
                let s_info = message_json.info;

                //message_json.info = '(REQUEST) ' + s_info;
                //connection.sendUTF(JSON.stringify(message_json));

                message_json.info = '(BROADCAST) ' + s_info;
                wss.broadcast(JSON.stringify(message_json));
            }
            else if (message_json.messagetype === constants.MESSAGE_TYPE_RESPONSE)
            {
                message_json['info'] = '(RESPONSE) ' +  message_json['info'];
                wss.broadcast(JSON.stringify(message_json));
            }
            else if (message_json.messagetype === constants.MESSAGE_TYPE_OTHER)
            {
                message_json['messagetype'] = constants.MESSAGE_TYPE_OTHER;
                message_json['info'] = '(BROADCAST) ' + message_json['info'];
                wss.broadcast(JSON.stringify(message_json));
            }
        }
        catch{
            var message_json  = {};
            message_json['sourcetype'] = constants.SOURCE_SERVER;
            message_json['sourcename'] = 'NodeJS Server';
            message_json['messagetype'] = constants.MESSAGE_TYPE_ERROR;
            message_json['info'] = message.utf8Data;
            connection.sendUTF(JSON.stringify(message_json));
        }

    });
    connection.on("close", (reasonCode, description) => {
        console.log("El cliente se desconecto - " + description);
    });
});

// Iniciamos el servidor en el puerto establecido por la variable port (3000)
server.listen(app.get('port'), () =>{
    console.log('App server listenning port: ' + app.get('port'));
})


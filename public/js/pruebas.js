
const MESSAGE_TYPE_REQUEST = 0;
const MESSAGE_TYPE_RESPONSE = 1;
const MESSAGE_TYPE_BROADCAST = 2;
const MESSAGE_TYPE_OTHER = 3;
const MESSAGE_TYPE_ERROR = -1;


// Se invoca cuando se oprime el botón Enviar
function sendTextData(event){
    event.preventDefault();
    var campo = event.target.texto;

    var message_json  = {};
    message_json['name'] = 'Web browser client'
    message_json['type'] = MESSAGE_TYPE_OTHER;
    message_json['info'] = campo.value;

    doSend(JSON.stringify(message_json));

    campo.value="";
}

// La función init se ejecuta cuando termina de cargarse la página
function init() {
    wsConnect();
}

// Invoca esta función para conectar con el servidor de WebSocket
function wsConnect() {
    websocket = new WebSocket("ws://localhost:3000");

    // Asignación de callbacks
    websocket.onopen = function (evt) {
        onOpen(evt)
    };
    websocket.onclose = function (evt) {
        onClose(evt)
    };
    websocket.onmessage = function (evt) {
        onMessage(evt)
    };
    websocket.onerror = function (evt) {
        onError(evt)
    };
}

function onOpen(evt) {
    document.getElementById("enviar").disabled = false;

    var message_json  = {};
    message_json['name'] = 'Web browser client'
    message_json['type'] = MESSAGE_TYPE_OTHER;
    message_json['info'] = "Conexión desde navegador web";

    doSend(JSON.stringify(message_json));
}

// Se ejecuta cuando la conexión con el servidor se cierra
function onClose(evt) {
    document.getElementById("enviar").disabled = true;

    setTimeout(function () {
        wsConnect()
    }, 2000);
}

function onMessage(evt) {
    var area = document.getElementById("mensajes");

    var message_json = JSON.parse(evt.data);
    var s_source = message_json.name;
    var s_info = message_json.info;
    var s_type = 
        message_json.type === MESSAGE_TYPE_REQUEST ? 'REQUEST' :  
        message_json.type === MESSAGE_TYPE_RESPONSE ? 'RESPONSE' :  
        message_json.type === MESSAGE_TYPE_BROADCAST ? 'BROADCAST' :  
        message_json.type === MESSAGE_TYPE_OTHER ? 'OTHER' : 'ERROR';
    
    var s_data_in_list = s_source + " - " + s_type + " - " + s_info;



    area.innerHTML += s_data_in_list + "\n";
}

function onError(evt) {
    console.log("ERROR: " + evt.data);
}

function doSend(message) {
    console.log("Enviando: " + message);
    websocket.send(message);
}


// Se invoca la función init cuando la página termina de cargarse
window.addEventListener("load", init, false);


const MESSAGE_TYPE_REQUEST = 0;
const MESSAGE_TYPE_RESPONSE = 1;
const MESSAGE_TYPE_BROADCAST = 2;
const MESSAGE_TYPE_OTHER = 3;
const MESSAGE_TYPE_ERROR = -1;

const SOURCE_SBP = 0;
const SOURCE_MASERMIC = 1;
const SOURCE_SERVER = 2;

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
    var message_json  = {};
    message_json['sourcetype'] = SOURCE_SERVER
    message_json['sourcename'] = 'Web browser client'
    message_json['messagetype'] = MESSAGE_TYPE_OTHER;
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
    var sbp_area = document.getElementById("sbp_messages_area");
    var masermic_area = document.getElementById("masermic_messages_area");
    var server_area = document.getElementById("server_messages_area");

    var message_json = JSON.parse(evt.data);

    var s_sourcetype = message_json.sourcetype;
    var s_sourcename = message_json.sourcename;
    var s_info = message_json.info;

    var s_messagetype = 
        message_json.messagetype === MESSAGE_TYPE_REQUEST ? 'REQUEST' :  
        message_json.messagetype === MESSAGE_TYPE_RESPONSE ? 'RESPONSE' :  
        message_json.messagetype === MESSAGE_TYPE_BROADCAST ? 'BROADCAST' :  
        message_json.messagetype === MESSAGE_TYPE_OTHER ? 'OTHER' : 'ERROR';
    
    var s_data_in_list = s_sourcename + " - " + s_messagetype + " - " + s_info;

    if (s_sourcetype === SOURCE_SBP)
    {
        sbp_area.innerHTML += s_data_in_list + "\n";
    }
    else if (s_sourcetype === SOURCE_MASERMIC)
    {
        masermic_area.innerHTML += s_data_in_list + "\n";
    }
    else if (s_sourcetype === SOURCE_SERVER)
    {
        server_area.innerHTML += s_data_in_list + "\n";
    }
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

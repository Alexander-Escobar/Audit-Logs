// Este archivo muestra, genera dos Instancias una identificada como MyApp y otra como MyServer.
// MyApp, guarda la informacion en app.log, con un maximo de 10 lineas por archivo, la salida a consola es utilizando colores, tambien esta utilizando un formato personalizado tipo JSON
// MyServer, guarda la informacion en server.log, Muestra la informacion en consola sin uso de colores, por defecto cada archivo tendra 10000 lineas.

const Audit_Logs = require('minervajs-auditlogs');

const logger = new Audit_Logs('MyApp', 
	{filenameBase:'app.log', 
	useColors: true, 
	maxLines: 10, 
	writeToDisk: true, 
	debuger: true, 
	format: '%colorbegin%{hora:"%timestamp%"} {nivel:"%level%"} {prefijo:"%prefix%"}%colorend% {msg:"%message%"}' 
	}
	);
	
const logserver = new Audit_Logs('MyServer', {filenameBase:'server.log', useColors: false, writeToDisk: true});
  
logger.info('Log entry 1');
logger.debug('Log entry 2');
logger.warn('Log entry 3');
logger.error('Log entry 4');
logger.info('Log entry 5');
logger.info('Log entry 6');
logger.debug('Log entry 7');
logger.info("Línea 8 de log.");
logger.info("Línea 9 de log.");
logger.info("Línea 10 de log."); // Debería rotar después de esta linea
logger.info("Línea 11 de log.");
logger.info("Línea 12 de log.");
logger.info("Línea 13 de log en el nuevo archivo.");
logger.info("Línea 14 log en el nuevo archivo.");
logger.info("Línea 15 log en el nuevo archivo.");
logger.debug("Mensaje de depuración.");
logger.error("¡Un error ha ocurrido!");
logger.warn("¡Un aviso!");

// Debería rotar aquí, nuevamente
for (let i = 0; i < 20; i++) 
{ logger.info(`Mensaje de prueba ${i + 1}`); }

for (let i = 0; i < 20; i++) 
{ logserver.info(`Mensaje de prueba ${i + 1}`); }
logserver.debug("Mensaje de depuración.");
logserver.error("¡Un error ha ocurrido!");
logserver.warn("¡Un aviso!");


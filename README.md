# MinervaJS Audit Logs
Módulo de gestión de mensajes de consola para su uso en auditoria, depuración, informativos, avisos y error.  
  
Ejemplo: Partiendo de un proyecto en blanco recien creado  
`$ npm i minervajs-auditlogs`  
  
#### Archivo: index.js  
```javascript
const logger = require('minervajs-auditlogs').getInstance('MyApp', 'app.log', true, 5, true);  
  
logger.info('Log entry 1');  
logger.debug('Log entry 2');  
logger.warn('Log entry 3');  
logger.error('Log entry 4');  
logger.info('Log entry 5'); // Debería rotar después de esta linea  
logger.info('Log entry 6');  
logger.debug('Log entry 7');  
logger.info("Línea 8 de log.");  
logger.info("Línea 9 de log.");  
logger.info("Línea 10 de log.");  // Debería rotar aquí, nuevamente
logger.info("Línea 11 de log.");  
logger.info("Línea 12 de log.");  
logger.info("Línea 13 de log en el nuevo archivo.");  
logger.info("Línea 14 log en el nuevo archivo.");  
logger.info("Línea 15 log en el nuevo archivo.");  
logger.debug("Mensaje de depuración.");  
logger.error("¡Un error ha ocurrido!");  
logger.warn("¡Un aviso!");  
```  
  
#### Salida en consola
![Descripción de la imagen](/images/CapturaAuditLogs.PNG)

#### La generacion de archivos
![Descripción de la imagen](/images/CapturaAuditLogsfiles.PNG)

En la instalacion, puedes hacer uso del archivo muestra que esta en \node_modules\minervajs-auditlogs\example\index.js  



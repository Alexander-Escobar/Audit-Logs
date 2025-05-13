# MinervaJS Audit Logs
Módulo de gestión de mensajes de consola para su uso en auditoria, depuración, informativos, avisos y error.  
  
Ejemplo: Partiendo de un proyecto en blanco recien creado  
`$ npm i minervajs-auditlogs`  
  
#### Archivo: index.js  
```javascript
const auditlogs = require('minervajs-auditlogs').getInstance('MyApp', 'app.log', true, 5, true);  
  
auditlogs.info('Log entry 1');  
auditlogs.debug('Log entry 2');  
auditlogs.warn('Log entry 3');  
auditlogs.error('Log entry 4');  
auditlogs.info('Log entry 5'); // Debería rotar después de esta linea  
auditlogs.info('Log entry 6');  
auditlogs.debug('Log entry 7');  
auditlogs.info("Línea 8 de log.");  
auditlogs.info("Línea 9 de log.");  
auditlogs.info("Línea 10 de log.");  // Debería rotar aquí, nuevamente
auditlogs.info("Línea 11 de log.");  
auditlogs.info("Línea 12 de log.");  
auditlogs.info("Línea 13 de log en el nuevo archivo.");  
auditlogs.info("Línea 14 log en el nuevo archivo.");  
auditlogs.info("Línea 15 log en el nuevo archivo.");  
auditlogs.debug("Mensaje de depuración.");  
auditlogs.error("¡Un error ha ocurrido!");  
auditlogs.warn("¡Un aviso!");  
```  
  
#### Salida en consola
![Descripción de la imagen](/images/CapturaAuditLogs.PNG)

#### La generacion de archivos
![Descripción de la imagen](/images/CapturaAuditLogsfiles.PNG)

En la instalacion, puedes hacer uso del archivo muestra que esta en \node_modules\minervajs-auditlogs\example\index.js  


## Documentacion de uso
Su propósito es proporcionar una forma personalizada de registrar mensajes en la consola con colores por nivel y opcionalmente guardarlos en archivos de log rotativos basados en el número de líneas.  
  
Características principales:
* Registro de logs con niveles (info, debug, warn, error).
* Colores opcionales en la consola para diferenciar niveles.
* Escritura opcional a archivos de log.
* Rotación automática de archivos basada en el número de líneas.
* Patrón Singleton para asegurar una única instancia del 'MinervaJS Audit Logs'.


#### Instalación
`$ npm i minervajs-auditlogs`  

Como Importar el modulo  
```javascript
const auditlogs = require('minervajs-auditlogs').getInstance('TuAplicacion');  
```  
Reemplaza 'TuAplicacion' con un prefijo descriptivo para tu aplicación o módulo.  

### Configuración Inicial  

El método getInstance permite configurar el  MinervaJS Audit Logs en su primera llamada. Las llamadas posteriores devolverán la misma instancia con la configuración inicial.  

### Parámetros de getInstance:  
* prefijo (opcional): Un string que se añadirá al inicio de cada mensaje de log para identificar la fuente. Por defecto es 'AuditLogs'.  
* filenameBase (opcional): Un string que define el nombre base del archivo de log. Los archivos rotados se nombrarán añadiendo un sufijo numérico (ej., app-1.log). Por defecto es app.log.  
* useColors (opcional): Un boolean que indica si se deben usar colores en la salida de la consola. Por defecto es true.  
* maxLines (opcional): Un number que especifica el número máximo de líneas que un archivo de log puede alcanzar antes de que se rote y se cree uno nuevo. Por defecto es 10000.  
* writeToDisk (opcional): Un boolean que controla si los logs deben escribirse en el archivo. Si es true, se escribirán; si es false, se omitirá la escritura a disco. Por defecto es false.  

#### Ejemplo de Uso Completo de caracteristicas:  
```javascript
const auditlogs = require('minervajs-auditlogs').getInstance('MiAplicacion', 'app.log', true, 10, true);  

auditlogs.info('La aplicación se ha iniciado.');  
auditlogs.debug('Información detallada sobre la configuración.');  
auditlogs.warn('Se ha detectado una condición inusual.');  
auditlogs.error('¡Error al procesar la solicitud!');  

// Después de 10 o más llamadas a los métodos de log, se creará un nuevo archivo (app-1.log).  
for (let i = 0; i < 15; i++) {  
  auditlogs.info(`Mensaje de prueba ${i + 1}`);  
}  
```  
  
#### Ejemplo de inicialización:  
```javascript
// Audit Logs con prefijo "MiServicio", archivo "servicio.log", colores habilitados, rotación cada 5000 líneas y escritura a disco.  
const loggerConArchivo = require('minervajs-auditlogs').getInstance('MiServicio', 'servicio.log', true, 5000, true);  

// Audit Logs con prefijo "ModuloX", solo salida a consola (sin escritura a disco).  
const loggerSoloConsola = require('minervajs-auditlogs').getInstance('ModuloX', 'modulo_x.log', true, 10000, false);  
```  

### Rotación de Archivos  

El MinervaJS Audit Logs automáticamente rotará el archivo de log actual cuando alcance el número máximo de líneas especificado en el parámetro maxLines durante la inicialización.  
Los archivos rotados se nombrarán añadiendo un número secuencial al filenameBase (ej., app-1.log, app-2.log, etc.).  
La rotación es transparente para el usuario; simplemente sigue utilizando los métodos de log.  

### Niveles de Log  

El 'MinervaJS Audit Logs' soporta los siguientes niveles de log:  
info: Para información general y eventos importantes.  
debug: Para información detallada útil durante el desarrollo y la depuración.  
warn: Para indicar posibles problemas o situaciones inesperadas que no son errores críticos.  
error: Para registrar errores que han ocurrido y que pueden requerir atención.  
Los mensajes de cada nivel se mostrarán en la consola con un color distintivo (si la opción useColors está habilitada)  

### Consideraciones Adicionales  

* Patrón Singleton: Recuerda que getInstance siempre devolverá la misma instancia del 'MinervaJS Audit Logs' después de la primera llamada. La configuración se aplica solo en la primera inicialización.  
* Rutas de Archivos: La ruta del archivo de log se resuelve de forma absoluta basada en el directorio del script donde se ejecuta el 'MinervaJS Audit Logs'.  

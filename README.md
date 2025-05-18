# MinervaJS Audit Logs
Módulo de gestión de mensajes de consola para su uso en auditoria, depuración, informativos, avisos y error.  
  
Ejemplo: Partiendo de un proyecto en blanco recien creado  
`$ npm i minervajs-auditlogs`  
  
#### Archivo: index.js  
```javascript  
const Audit_Logs = require('minervajs-auditlogs');  
  
// Permite generar un Log, identificado con prefijo MyApp, habilitando salida en paralelo a disco, donde el archivo tendra un maximo de 10 lineas antes de generar otro.
const auditlogs = new Audit_Logs('MyApp', { writeToDisk: true, maxLines: 10, debuger: true });  
  
auditlogs.info('Log entry 1');  
auditlogs.debug('Log entry 2');  
auditlogs.warn('Log entry 3');  
auditlogs.error('Log entry 4');  
auditlogs.info('Log entry 5');
auditlogs.info('Log entry 6');  
auditlogs.debug('Log entry 7');  
auditlogs.info("Línea 8 de log.");  
auditlogs.info("Línea 9 de log.");  
auditlogs.info("Línea 10 de log.");  // Debería rotar despues de esta linea
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
* Permite Multiples instancias.


#### Instalación
`$ npm i minervajs-auditlogs`  

Como Importar el modulo  
```javascript
const Audit_Logs = require('minervajs-auditlogs');  

const auditlogs = new Audit_Logs('TuAplicacion',  
	{filenameBase:'app.log',  
	useColors: true,  
	maxLines: 5,  
	writeToDisk: true,  
	debuger: true,  
	format: '%colorbegin%{%timestamp%} {%level%} {%prefix%}%colorend% - %message%' }  
	);  
```  
Reemplaza 'TuAplicacion' con un prefijo descriptivo para tu aplicación o módulo.  

### Configuración Inicial  

El método permite configurar el 'MinervaJS Audit Logs' en su primera llamada. Las llamadas posteriores devolverán la misma instancia con la configuración inicial.  

### Parámetros de Configuración:  
* prefijo (opcional): Un string que se añadirá al inicio de cada mensaje de log para identificar la fuente. Por defecto es 'AuditLogs'.  
* filenameBase (opcional): Un string que define el nombre base del archivo de log. Los archivos rotados se nombrarán añadiendo un sufijo numérico (ej., app-1.log). Por defecto es app.log.  
* useColors (opcional): Un boolean que indica si se deben usar colores en la salida de la consola. Por defecto es true.  
* maxLines (opcional): Un number que especifica el número máximo de líneas que un archivo de log puede alcanzar antes de que se rote y se cree uno nuevo. Por defecto es 10000, la cantidad minima es 100 si se ha habilitado el banderin debuger=true permite que esta cantidad sea menor a 100.
* writeToDisk (opcional): Un boolean que controla si los logs deben escribirse en el archivo. Si es true, se escribirán; si es false, se omitirá la escritura a disco. Por defecto es false.  
* debuger (opcional): un banderin que habilita opciones para depuración, como el poder definir maxLines con menos de 100 lineas.
* format (opcional): Permitir a los usuarios definir su propio formato para las líneas de log. Esto podría incluir el orden de los elementos (timestamp, prefijo, nivel, mensaje), la inclusión de información adicional (como el nombre del archivo y la línea donde se generó el log), o formatos más estructurados (como JSON). El formato por defecto es '[%timestamp%] [%prefix%]%colorbegin% [%level%] %message% %colorend%'  
    * %colorbegin% / %colorend%, indica inicio y fin de uso de color respectivamente  
	* %timestamp%, marcador para fecha y hora  
	* %level%, marcador de nivel  
	* %prefix%, marcador para la inclusión de uso de identificador de Aplicativo o modulo  
	* %message%, marcador para el contenido del Mensaje  
	* %currentline%, El número de línea actual en el archivo de log (Solo se visualiza en archivo)
  
  
#### Ejemplo de Uso Completo de caracteristicas:  
```javascript  
const Audit_Logs = require('minervajs-auditlogs');  
  
// Audit Logs con prefijo "MiAplicacion", archivo "app.log", colores habilitados, rotación cada 10 líneas, escritura a disco, con debuger para permitir definir menos de 100 lineas en el archivo y un formato personalizado tipo JSON.  
const auditlogs = new Audit_Logs('MiAplicacion',  
	{filenameBase:'app.log',  
	useColors: true,  
	maxLines: 10,  
	writeToDisk: true,  
	debuger: true,  
	format: '%colorbegin%{hora:"%timestamp%"} {nivel:"%level%"} {prefijo:"%prefix%"}%colorend% {msg:"%message%"}' }  
	);  
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
const Audit_Logs = require('minervajs-auditlogs');  
  
// Audit Logs con prefijo "MiServicio", archivo "servicio.log", colores habilitados, rotación cada 5000 líneas y escritura a disco.  
const loggerConArchivo = new Audit_Logs('MiServicio',  
	{filenameBase:'servicio.log',  
	useColors: true,  
	maxLines: 5000,  
	writeToDisk: true
	);  

// Audit Logs con prefijo "ModuloX", solo salida a consola (sin escritura a disco).  
const loggerSoloConsola = new Audit_Logs('ModuloX',  
	{filenameBase:'modulo_x.log',  
	useColors: true,  
	maxLines: 10000,  
	writeToDisk: false  
	);  

```  

### Rotación de Archivos  

* El 'MinervaJS Audit Logs' automáticamente rotará el archivo de log actual cuando alcance el número máximo de líneas especificado en el parámetro maxLines durante la inicialización.  
* Los archivos rotados se nombrarán añadiendo un número secuencial al filenameBase (ej., app-1.log, app-2.log, etc.).  
La rotación es transparente para el usuario; simplemente sigue utilizando los métodos de log.  

### Niveles de Log  

El 'MinervaJS Audit Logs' soporta los siguientes niveles de log:  
* info: (information) Para información general y eventos importantes.  
* debug: Para información detallada útil durante el desarrollo y la depuración.  
* warn: (warning) Para indicar posibles problemas o situaciones inesperadas que no son errores críticos.  
* error: Para registrar errores que han ocurrido y que pueden requerir atención.  
Los mensajes de cada nivel se mostrarán en la consola con un color distintivo (si la opción useColors está habilitada)  

### Consideraciones Adicionales  

* Rutas de Archivos: La ruta del archivo de log se resuelve de forma absoluta basada en el directorio del script donde se ejecuta el 'MinervaJS Audit Logs'.  
* inicialización: En cada Instancia, los primeras Lineas, indicaran la Configuración con que inicia 'MinervaJS Audit Logs' y son tambien parte de la cuota de maxLines.
* Rotación de Archivo: El llegar a la cuota de rotación de archivo maxLines, se adicionara una linea al final del archivo indicando fin del mismo. por defecto cada archivo tendria maxLines + 1.


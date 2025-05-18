/** @module Audit_Logs */
const fs = require('node:fs/promises');
const path = require('node:path');

// Códigos de escape ANSI para colores
const colores = 
{
  reset: '\x1b[0m',
  rojo: '\x1b[31m',			//
  verde: '\x1b[32m',		//
  amarillo: '\x1b[33m',		//
  azul: '\x1b[34m',			//
  magenta: '\x1b[35m',
  cian: '\x1b[36m',
  gris: '\x1b[90m',			//
};

/**
 * Clase Audit_Logs personalizada que permite registrar mensajes en la consola con colores
 * por nivel y también guardarlos en archivos de log rotativos basados en el número de líneas.
 */
class Audit_Logs 
{
  /**
   * Crea una instancia del Audit_Logs.
   * @param {string} [prefijo=''] - Un prefijo opcional que se añadirá a cada mensaje de log.
   * @param {string} [filenameBase='app.log'] - El nombre base del archivo de log. Se le
   * añadirá un sufijo numérico para la rotación.
   * @param {boolean} [useColors=true] - Indica si se deben usar colores en la salida de la consola.
   * @param {number} [maxLines=10000] - El número máximo de líneas por archivo de log antes de la rotación.
   * @param {boolean} [writeToDisk=false] - Indica si se realizaran escrituras a disco en paralelo despues de la escritura en consola.
   */
  constructor(prefijo = 'AuditLogs', options = {}) 
  {
    /**
     * El prefijo que se añade a cada mensaje de log.
     * @type {string}
     */
    this.prefijo = prefijo;
	
    /**
     * El nombre base del archivo de log.
     * @type {string}
     */
    this.filenameBase = path.resolve(__dirname, options?.filenameBase ?? 'app.log');

    /**
     * Indica si se deben usar colores en la salida de la consola.
     * @type {boolean}
     */
	this.useColors = options?.useColors ?? true;

    /**
     * Indica si se realizaran escrituras en modo depuracion, esto permite adicionar caracteristicas de depuracion, como maxLines < 100 lineas.
     * @type {boolean}
     */
	this.debuger = options?.debuger ?? false;

    /**
     * El número máximo de líneas por archivo de log antes de la rotación.
	 * No se permite un minimo menor a 100 lineas a menos que estemos trabajando en modo debug = true
     * @type {number}
     */
	this.maxLines = options?.maxLines ?? 10000;
	if (this.maxLines < 100 && this.debuger === false)
	{ this.maxLines = 100; }

    /**
     * Indica si se realizaran escrituras a disco en paralelo despues de la escritura en consola.
     * @type {boolean}
     */
	this.writeToDisk = options?.writeToDisk ?? false;
	
    /**
     * Permitir a los usuarios definir su propio formato para las líneas de log.
	 * Esto podría incluir el orden de los elementos (timestamp, prefijo, nivel, mensaje), la inclusión de información adicional (como el nombre del archivo y la línea donde se generó el log)
	 * o formatos más estructurados (como JSON)
     * @type {string}
     */
	this.format = options?.format ?? '[%timestamp%] [%prefix%]%colorbegin% [%level%] %message% %colorend%';
	

    /**
     * El número de línea actual en el archivo de log actual.
     * @private
     * @type {number}
     */
    this.currentLineCount = 0;

    /**
     * El número de secuencia del archivo de log actual.
     * @private
     * @type {number}
     */
    this.fileSequence = 1;

    /**
     * La ruta completa del archivo de log actual.
     * @private
     * @type {string}
     */
    this.currentFilename = this.getFilename();

    /**
     *  Cola de promesas para asegurar el orden de escritura
     * @private
     * @type {Promise}
     */	
    this.writeQueue = Promise.resolve();
	
	this.start(`Prefijo:            ${this.prefijo}`);
	this.start(`Nombre Archivo Base:${this.filenameBase}`);
	this.start(`Uso de Color:       ${this.useColors}`);
	this.start(`Max Lineas:         ${this.maxLines}`);
	this.start(`Escritura a Disco:  ${this.writeToDisk}`);
  }

  /**
   * Genera el nombre del archivo de log actual basado en el nombre base y la secuencia.
   * @private
   * @returns {string} La ruta completa del archivo de log actual.
   */
  getFilename() 
  {
    const { name, ext } = path.parse(this.filenameBase);
    return `${name}-${this.fileSequence}${ext}`;
  }

  /**
   * Rota el archivo de log actual, cerrándolo y creando uno nuevo con la siguiente secuencia.
   * No necesitamos explícitamente cerrar el archivo con appendFile; el sistema operativo se encarga.
   * La próxima escritura a un archivo con un nombre diferente creará uno nuevo.
   * @async
   * @private
   */
  async rotateLogFile() 
  {
	let l_message;
    this.currentLineCount = 0;
    this.fileSequence++;
    this.currentFilename = this.getFilename();
  }

  /**
   * Registra un mensaje con el nivel especificado.
   * @async
   * @param {string} nivel - El nivel del log ('info', 'debug', 'warn', 'error').
   * @param {string} mensaje - El mensaje que se va a registrar.
   */
  log(nivel, mensaje)
  {
    const ahora = new Date().toISOString();
    const nivelTexto = nivel.toUpperCase();
    let lineaConsola = this.formatLog(nivel, mensaje);
    const lineaArchivo = this.formatLog(nivel, mensaje, "archivo"); //`[${ahora}] [${this.prefijo}] [${nivelTexto}] ${mensaje}\n`;

	// Mostrar en consola
    console.log(lineaConsola);

	// Escribir en archivo
	// Si writeToDisk es false, simplemente omitimos la escritura.
    if (this.writeToDisk) 
	{
	  // Encolar la operación de escritura
      this.writeQueue = this.writeQueue.then(async () => {
        try 
		{
          this.currentLineCount++;
          if (this.currentLineCount >= this.maxLines) 
		  { await fs.appendFile(this.currentFilename, lineaArchivo + `Rotando archivo de log ${this.currentFilename}\r`, 'utf8');
			await this.rotateLogFile(); }
		  else
		  { await fs.appendFile(this.currentFilename, lineaArchivo, 'utf8'); }
        } 
		catch (error) 
		{
          console.error('Error al escribir en el archivo de log:', error);
          return Promise.resolve();
        }
      });
    }
  }
  
  formatLog(a_nivel, a_mensaje, a_tipo = 'consola') 
  {
	let l_formatted = this.format || '[%timestamp%] [%prefix%]%colorbegin% [%level%] %message% %colorend%';
	const l_now = new Date().toISOString();
	
	l_formatted = l_formatted.replace('%timestamp%', l_now);
	l_formatted = l_formatted.replace('%level%', a_nivel.toUpperCase());
	l_formatted = l_formatted.replace('%prefix%', this.prefijo);
	
	if (a_tipo == 'archivo')
	{
		l_formatted = l_formatted.replace('%colorbegin%', '');
		l_formatted = l_formatted.replace('%colorend%', '');
		l_formatted = l_formatted + '\n';
	}

	// Aplicar colores a la salida de la consola
    if (this.useColors)
	{
      switch (a_nivel)
	  {
        case 'start': 
			l_formatted = l_formatted = l_formatted.replace('%colorbegin%', colores.gris);
			l_formatted = l_formatted.replace('%colorend%', colores.reset);
			break;
        case 'info': 
			l_formatted = l_formatted = l_formatted.replace('%colorbegin%', colores.verde);
			l_formatted = l_formatted.replace('%colorend%', colores.reset);
			break;
        case 'debug': 
			l_formatted = l_formatted = l_formatted.replace('%colorbegin%', colores.azul);
			l_formatted = l_formatted.replace('%colorend%', colores.reset);
			break;
        case 'warn': 
			l_formatted = l_formatted = l_formatted.replace('%colorbegin%', colores.amarillo);
			l_formatted = l_formatted.replace('%colorend%', colores.reset);
			break;
        case 'error': 
			l_formatted = l_formatted = l_formatted.replace('%colorbegin%', colores.rojo);
			l_formatted = l_formatted.replace('%colorend%', colores.reset);
			break;
      }
    }
	else
	{
		l_formatted = l_formatted = l_formatted.replace('%colorbegin%', colores.gris);
		l_formatted = l_formatted.replace('%colorend%', colores.reset);
	}
	
	l_formatted = l_formatted.replace('%message%', a_mensaje);
	
	return l_formatted;
  }
  
  
  /**
   * Registra un mensaje con nivel 'Start'.
   * @param {string} mensaje - El mensaje inicializacion.
   */
  start(mensaje) { this.log('start', mensaje); }

  /**
   * Registra un mensaje con nivel 'info'.
   * @param {string} mensaje - El mensaje informativo.
   */
  info(mensaje) { this.log('info', mensaje); }
  
  /**
   * Registra un mensaje con nivel 'debug'.
   * @param {string} mensaje - El mensaje de depuración.
   */
  debug(mensaje) { this.log('debug', mensaje); }
  
  /**
   * Registra un mensaje con nivel 'error'.
   * @param {string} mensaje - El mensaje de error.
   */
  error(mensaje) { this.log('error', mensaje); }
  
  /**
   * Registra un mensaje con nivel 'warn'.
   * @param {string} mensaje - El mensaje de advertencia.
   */
  warn(mensaje) { this.log('warn', mensaje); }
}

module.exports = Audit_Logs;

// {
//   getInstance: (prefijo, filenameBase, useColors, maxLines, writeToDisk) => {
//     if (!instance) 
// 	{ instance = new Audit_Logs(prefijo, filenameBase, useColors, maxLines, writeToDisk); }
//     return instance;
//   },
// };

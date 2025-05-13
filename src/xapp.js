/** @module Logger */
const fs = require('node:fs/promises');
const path = require('node:path');

// Códigos de escape ANSI para colores
const colores = 
{
  reset: '\x1b[0m',
  rojo: '\x1b[31m',
  verde: '\x1b[32m',
  amarillo: '\x1b[33m',
  azul: '\x1b[34m',
  magenta: '\x1b[35m',
  cian: '\x1b[36m',
  gris: '\x1b[90m',
};

/**
 * Clase Logger personalizada que permite registrar mensajes en la consola con colores
 * por nivel y también guardarlos en archivos de log rotativos basados en el número de líneas.
 */
 class Logger 
 {
  /**
   * Crea una instancia del Logger.
   * @param {string} [prefijo=''] - Un prefijo opcional que se añadirá a cada mensaje de log.
   * @param {string} [filenameBase='app.log'] - El nombre base del archivo de log. Se le
   * añadirá un sufijo numérico para la rotación.
   * @param {boolean} [useColors=true] - Indica si se deben usar colores en la salida de la consola.
   * @param {number} [maxLines=10000] - El número máximo de líneas por archivo de log antes de la rotación.
   */
  constructor(prefijo = '', filenameBase = 'app.log', useColors = true, maxLines = 10000) 
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
    this.filenameBase = path.resolve(__dirname, filenameBase);
    /**
     * Indica si se deben usar colores en la salida de la consola.
     * @type {boolean}
     */
    this.useColors = useColors;
    /**
     * El número máximo de líneas por archivo de log antes de la rotación.
     * @type {number}
     */
    this.maxLines = maxLines;
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
   * @async
   * @private
   */
  async rotateLogFile() 
  {
    this.currentLineCount = 0;
    this.fileSequence++;
    this.currentFilename = this.getFilename();
    console.log(`Rotando archivo de log a: ${this.currentFilename}`);
    // No necesitamos explícitamente cerrar el archivo con appendFile; el sistema operativo se encarga.
    // La próxima escritura a un archivo con un nombre diferente creará uno nuevo.
  }

  /**
   * Registra un mensaje con el nivel especificado.
   * @async
   * @param {string} nivel - El nivel del log ('info', 'debug', 'warn', 'error').
   * @param {string} mensaje - El mensaje que se va a registrar.
   */
  async log(nivel, mensaje) 
  {
    const ahora = new Date().toISOString();
    const nivelTexto = nivel.toUpperCase();
    let lineaConsola = `[${ahora}] [${this.prefijo}] [${nivelTexto}] ${mensaje}`;
    const lineaArchivo = `[${ahora}] [${this.prefijo}] [${nivelTexto}] ${mensaje}\n`;

    // Aplicar colores a la salida de la consola
    if (this.useColors) 
	{
      switch (nivel) 
	  {
        case 'info':
          lineaConsola = `${colores.verde}${lineaConsola}${colores.reset}`;
          break;
        case 'debug':
          lineaConsola = `${colores.azul}${lineaConsola}${colores.reset}`;
          break;
        case 'warn':
          lineaConsola = `${colores.amarillo}${lineaConsola}${colores.reset}`;
          break;
        case 'error':
          lineaConsola = `${colores.rojo}${lineaConsola}${colores.reset}`;
          break;
        default:
          break;
      }
    }

    // Mostrar en consola
    console.log(lineaConsola);

    // Escribir en archivo de forma asíncrona
    try 
	{
	  console.log("this.currentLineCount");
	  console.log(this.currentLineCount);
      await fs.appendFile(this.currentFilename, lineaArchivo, 'utf8');
      this.currentLineCount = this.currentLineCount + 1;
      if (this.currentLineCount >= this.maxLines)
	  { await this.rotateLogFile(); }
    } 
	catch (error) 
	{ console.error('Error al escribir en el archivo de log:', error); }
  }

  /**
   * Registra un mensaje con nivel 'info'.
   * @param {string} mensaje - El mensaje informativo.
   */
  info(mensaje) 
  { this.log('info', mensaje); }

  /**
   * Registra un mensaje con nivel 'debug'.
   * @param {string} mensaje - El mensaje de depuración.
   */
  debug(mensaje) 
  { this.log('debug', mensaje); }

  /**
   * Registra un mensaje con nivel 'error'.
   * @param {string} mensaje - El mensaje de error.
   */
  error(mensaje) 
  { this.log('error', mensaje); }

  /**
   * Registra un mensaje con nivel 'warn'.
   * @param {string} mensaje - El mensaje de advertencia.
   */
  warn(mensaje) 
  { this.log('warn', mensaje); }
}


let instance = null;

module.exports = {
    getInstance: (prefijo, filenameBase, useColors, maxLines) => {
        if (!instance) 
		{ instance = new Logger(prefijo, filenameBase, useColors, maxLines); }
        return instance;
    },
};

// module.exports = Logger; // Exportamos la clase para poder usarla en otros módulos

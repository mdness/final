import { Router } from 'express';
import { allArguments } from '../config/arguments';
import Config from '../config';
import os from 'os';

const router = Router();

/**
 * @swagger
 * /api/info:
 *   get:
 *     summary: Devuelve la información del servidor
 *     tags:
 *       - Info
 *     responses:
 *       200:
 *         description: Información del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InfoData'
 */
router.get('/', async (req, res) => {
  let getData = {
    'Argumentos de entrada': JSON.stringify(allArguments),
    'Versión de node': process.version,
    'Versión de express': require('express/package.json').version,
    'Versión de mongoose': require('mongoose/package.json').version,
    'Versión de mongodb': require('mongodb/package.json').version,
    'Carpeta corriente': process.execPath,
    'Carpeta de trabajo': process.execPath,
    'Path de ejecución': process.cwd(),
    'Puerto de escucha': Config.PORT,
    'Nombre del usuario': os.userInfo().username,
    'Nombre de la plataforma': process.platform,
    'Nombre del sistema operativo': os.platform(),
    'Nombre del sistema': os.hostname(),
    HomeDir: os.userInfo().homedir,
    'Process id': process.pid,
    'Numero de CPUs': os.cpus().length,
    'Uso de memoria': process.memoryUsage()
  };
  res.status(200).json(getData);
});

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     InfoData:
 *       type: object
 *       properties:
 *          Argumentos de entrada:
 *           type: string
 *           description: Argumentos de entrada
 *           example: --port=3000 --persistence=true
 *          Versión de node:
 *            type: string
 *            description: Versión de node
 *            example: v12.13.1
 *          Versión de express:
 *           type: string
 *           description: Versión de express
 *           example: 4.17.1
 *          Versión de mongoose:
 *           type: string
 *           description: Versión de mongoose
 *           example: 5.7.8
 *          Versión de mongodb:
 *            type: string
 *            description: Versión de mongodb
 *            example: 3.4.24
 *          Carpeta corriente:
 *            type: string
 *            description: Carpeta corriente
 *            example: /home/user/Documents/node/node-express-mongodb-typescript/
 *          Carpeta de trabajo:
 *            type: string
 *            description: Carpeta de trabajo
 *            example: /home/user/Documents/node/node-express-mongodb-typescript/
 *          Path de ejecución:
 *            type: string
 *            description: Path de ejecución
 *            example: /home/user/Documents/node/node-express-mongodb-typescript/
 *          Nombre de usuario:
 *            type: string
 *            description: Nombre de usuario
 *            example: user
 *          Nombre de la plataforma:
 *            type: string
 *            description: Nombre de la plataforma
 *            example: Linux
 *          Nombre del sistema operativo:
 *            type: string
 *            description: Nombre del sistema operativo
 *            example: Linux
 *          Nombre del sistema:
 *            type: string
 *            description: Nombre del sistema
 *            example: Pepe PC
 *          HomeDir:
 *            type: string
 *            description: HomeDir
 *            example: /home/user/Documents/node/node-express-mongodb-typescript/
 *          Process id:
 *            type: number
 *            description: Process id
 *            example: 1234
 *          Numero de CPUs:
 *            type: string
 *            description: Numero de CPUs
 *            example: 4
 *          Uso de memoria:
 *            type: object
 *            description: Uso de memoria
 *            example: {"rss":305782784,"heapTotal":250281984,"heapUsed":245057336,"external":47093336,"arrayBuffers":18390201}
 */

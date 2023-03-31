import Config from './config';
import { portArgument, clusterArgument } from './config/arguments';
import cluster from 'cluster';
import initWsServer from './services/sockets';
import myServer from './services/server';
import { Logger } from './utils/logger';

const port = portArgument || Config.PORT;
const clusterSetting = clusterArgument || false;

initWsServer(myServer);

if (clusterSetting && cluster.isMaster) {
    Logger.info('Cluster mode enabled');
    for (let i = 0; i < require('os').cpus().length; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        Logger.info(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
  myServer.listen(port, () => Logger.info(`SERVER UP IN PORT ${port}`));
}

myServer.on('error', (err) => {
  Logger.error('SERVER ERROR: ', err);
});

// Log on exit
process.on('exit', (code) => {
  Logger.error(`Exit ==> El proceso termino con codigo ${code}\n\n`);
});

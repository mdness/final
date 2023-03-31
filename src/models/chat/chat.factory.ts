// import { PersistenciaSQLite3 } from './DAOS/sqlite3DAO';
import { PersistenciaMongo } from './DAOs/mongoDAO';
import { Logger } from '../../utils/logger';

export enum Persistencia {
  Mongo = 'MONGO'
}

export class ChatFactory {
  static get(tipo: Persistencia) {
    switch (tipo) {
      case Persistencia.Mongo:
        Logger.info('Chat está escribiendo en MongoDB');
        return new PersistenciaMongo();

      default:
        Logger.info('Chat está escribiendo en MongoDB por default');
        return new PersistenciaMongo();
    }
  }
}

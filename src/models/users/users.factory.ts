import { PersistenciaMongo } from './DAOs/mongoDAO';
import { Logger } from '../../utils/logger';

export enum Persistencia {
  Mongo = 'MONGO'
}

export class UsersFactory {
  static get(tipo: Persistencia) {
    switch (tipo) {
      case Persistencia.Mongo:
        Logger.info('Usuarios está escribiendo en Mongo');
        return new PersistenciaMongo();

      default:
        Logger.info('Usuarios está escribiendo en Mongo por default');
        return new PersistenciaMongo();
    }
  }
}

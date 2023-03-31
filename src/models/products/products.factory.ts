import { PersistenciaMongo } from './DAOs/mongoDAO';
import { Logger } from '../../utils/logger';

export enum Persistencia {
  Mongo = 'MONGO'
}

export class ProductsFactory {
  static get(tipo: Persistencia) {
    switch (tipo) {
      case Persistencia.Mongo:
        Logger.info('Productos está escribiendo en Mongo');
        return new PersistenciaMongo();

      default:
        Logger.info('Productos está escribiendo en Mongo por default');
        return new PersistenciaMongo();
    }
  }
}

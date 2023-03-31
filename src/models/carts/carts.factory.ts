import { PersistenciaMongo } from './DAOs/mongoDAO';
import { Logger } from '../../utils/logger';

export enum Persistencia {
  Mongo = 'MONGO'
}

export class CartFactory {
  static get(tipo: Persistencia) {
    switch (tipo) {
      case Persistencia.Mongo:
        Logger.info('Carrito está escribiendo en MongoDB');
        return new PersistenciaMongo();
      default:
        Logger.info('Carrito está escribiendo en MongoDB por default');
        return new PersistenciaMongo();
    }
  }
}

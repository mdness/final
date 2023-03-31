import { PersistenciaMongo } from './DAOs/mongoDAO';
import { Logger } from '../../utils/logger';

export enum Persistencia {
  Mongo = 'MONGO'
}

export class OrderFactory {
  // Esto debería ser tipo generico para todos los DAO
  private static instance: PersistenciaMongo;

  private constructor() {}

  static get(tipo: Persistencia) {
    switch (tipo) {
      case Persistencia.Mongo:
        Logger.info('Orders está escribiendo en MongoDB');
        if (!OrderFactory.instance) {
          OrderFactory.instance = new PersistenciaMongo();
        }
        return OrderFactory.instance;

      default:
        Logger.info('Orders está escribiendo en MongoDB por default');
        if (!OrderFactory.instance) {
          OrderFactory.instance = new PersistenciaMongo();
        }
        return OrderFactory.instance;
    }
  }
}

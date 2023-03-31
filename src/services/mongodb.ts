import Config from '../config';
import mongoose, { Connection } from 'mongoose';

mongoose.Promise = global.Promise;

const localURL = `mongodb://localhost:27017/${Config.MONGO_LOCAL_DBNAME}`;
const atlasURL = `mongodb+srv://${Config.MONGO_ATLAS_USER}:${Config.MONGO_ATLAS_PASSWORD}@${Config.MONGO_ATLAS_CLUSTER}/${Config.MONGO_ATLAS_DBNAME}?retryWrites=true&w=majority`;
export let mongoURL = '';

export class MongoDB {
  private instance: number;
  private uri: string;
  private connection?: Connection;

  constructor(local?: boolean) {
    this.uri = local ? localURL : atlasURL;
    mongoURL = this.uri;
    this.instance = 0;
  }

  getConnection() {
    if (!this.connection) this.connection = mongoose.createConnection(this.uri);
    return this.connection;
  }

  closeConnection() {
    mongoose.disconnect();
  }
}

import dotenv from 'dotenv';
import { Logger } from '../utils/logger';

dotenv.config();
Logger.info('Inicializando en entorno: ' + process.env.NODE_ENV);

const venv = {
  NODE_ENV: process.env.NODE_ENV || 'development',

  PORT: process.env.PORT || 8080,

  JWT_SECRET_KEY: process.env.TOKEN_SECRET_KEY || 'secret',
  TOKEN_KEEP_ALIVE: process.env.TOKEN_KEEP_ALIVE || '10m',

  MONGO_ATLAS_USER: process.env.MONGO_ATLAS_USER || 'user',
  MONGO_ATLAS_PASSWORD: process.env.MONGO_ATLAS_PASSWORD || 'pwd',
  MONGO_ATLAS_CLUSTER: process.env.MONGO_ATLAS_CLUSTER || 'clusterUrl',
  MONGO_ATLAS_DBNAME: process.env.MONGO_ATLAS_DBNAME || 'dbName',
  MONGO_ATLAS_URI:
    process.env.MONGO_ATLAS_URI ||
    'mongodb://' +
      process.env.MONGO_ATLAS_USER +
      ':' +
      process.env.MONGO_ATLAS_PASSWORD +
      '@' +
      process.env.MONGO_ATLAS_CLUSTER +
      '/' +
      process.env.MONGO_ATLAS_DBNAME +
      '?retryWrites=true&w=majority',

  MONGO_LOCAL_DBNAME: process.env.MONGO_LOCAL_DBNAME || 'dbNameLocal',

  ETHEREAL_USERNAME: process.env.ETHEREAL_USERNAME || 'user',
  ETHEREAL_EMAIL: process.env.ETHEREAL_EMAIL || 'email',
  ETHEREAL_PASSWORD: process.env.ETHEREAL_PASSWORD || 'pwd',

  GMAIL_USERNAME: process.env.GMAIL_USERNAME || 'user',
  GMAIL_EMAIL: process.env.GMAIL_EMAIL || 'email',
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD || 'pwd',

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'cloudName',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || 'apiKey',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || 'apiSecret'
};

export default venv;

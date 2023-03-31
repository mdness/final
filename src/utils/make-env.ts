import fs from 'fs';
import { Logger } from './logger';

fs.renameSync('../../env.example', './.env');
Logger.info('.env file created');

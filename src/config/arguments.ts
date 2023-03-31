import minimist from 'minimist';
import { Logger } from '../utils/logger';

const args = minimist(process.argv.slice(2));

if (args.h) Logger.verbose(`Argumentos validos: port=NUMBER`);

export const allArguments = args;
export const portArgument = args.port;
export const clusterArgument = args.cluster;
export const PersistenceArgument = args.persistence;

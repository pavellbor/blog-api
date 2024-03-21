import convict from 'convict';
import validators from 'convict-format-with-validator';

export type RestSchema = {
  PORT: string;
  DB_URI: string;
  LOG_FILE_PATH: string;
  UPLOAD_DIRECTORY: string;
  JWT_SECRET: string;
  HOST: string;
  STATIC_DIRECTORY_PATH: string;
};

convict.addFormats(validators);

export const restConfigSchema = convict<RestSchema>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: '3000',
  },
  DB_URI: {
    doc: 'Uri to connect to the database',
    format: String,
    env: 'DB_URI',
    default: null,
  },
  LOG_FILE_PATH: {
    doc: 'Path to log file',
    format: String,
    env: 'LOG_FILE_PATH',
    default: 'logs/rest.log',
  },
  UPLOAD_DIRECTORY: {
    doc: 'Directory for upload files',
    format: String,
    env: 'UPLOAD_DIRECTORY',
    default: null,
  },
  JWT_SECRET: {
    doc: 'Secret for sign JWT',
    format: String,
    env: 'JWT_SECRET',
    default: null,
  },
  HOST: {
    doc: 'Host where started service',
    format: String,
    env: 'HOST',
    default: 'localhost',
  },
  STATIC_DIRECTORY_PATH: {
    doc: 'Path to directory with static resources',
    format: String,
    env: 'STATIC_DIRECTORY_PATH',
    default: 'static',
  },
});

import { getDefaultPinoLoggerOptions, PinoLogger } from 'ct-common-lib';
require('dotenv').config();

const level = ['test', 'local', 'development'].includes(process.env.NODE_ENV || '') ? 'debug' : 'info';
const logger = new PinoLogger(getDefaultPinoLoggerOptions(level));
export default logger;

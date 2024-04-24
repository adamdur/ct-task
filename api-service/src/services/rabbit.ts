import rabbitConfig from '../config/rabbitConfig';
import logger from '../logger';
import { Broker } from 'ct-common-lib';

const rabbit = Broker.getInstance(rabbitConfig, logger);
export default rabbit;

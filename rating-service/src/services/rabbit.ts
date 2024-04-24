import { Broker } from 'ct-common-lib';
import rabbitConfig from '../config/rabbitConfig';
import logger from '../logger';

const rabbit = Broker.getInstance(rabbitConfig, logger);
export default rabbit;

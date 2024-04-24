import { BrokerConfig } from 'ct-common-lib';
require('dotenv').config();

const rabbitConfig: BrokerConfig = {
  url: process.env.RABBITMQ_URL || 'amqp://localhost',
};

export default rabbitConfig;

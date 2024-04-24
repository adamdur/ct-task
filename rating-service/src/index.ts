import logger from './logger';
import sequelize from './services/sequelize';
import rabbit from './services/rabbit';
import { setupConsumers } from './pubsub/consumers';

sequelize
  .authenticate()
  .then(() => logger.info('PGSQL Connection has been established successfully.'))
  .catch((err) => logger.error(`Unable to connect to the database: ${err}`));

rabbit
  .getConnection()
  .then(() => {})
  .catch((err) => logger.error(`Unable to connect to the RabbitMQ: ${err}`));

setupConsumers();

['SIGTERM', 'SIGINT'].forEach((signal) => {
  process.on(signal, async () => {
    logger.info(`Received ${signal}, gracefully shutting down`);
    setTimeout(async () => {
      await rabbit.close();
      await sequelize.close();
      process.exit(0);
    }, 5000);
  });
});

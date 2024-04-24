import app from './app';
import logger from './logger';
import sequelize from './services/sequelize';
import rabbit from './services/rabbit';
import { setupConsumers } from './pubsub/consumers';
import redis from './services/redis';

sequelize
  .authenticate()
  .then(() => logger.info('PGSQL Connection has been established successfully.'))
  .catch((err) => logger.error(`Unable to connect to the database: ${err}`));

rabbit
  .getConnection()
  .then(() => {})
  .catch((err) => logger.error(`Unable to connect to the RabbitMQ: ${err}`));

setupConsumers();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

['SIGTERM', 'SIGINT'].forEach((signal) => {
  process.on(signal, async () => {
    logger.info(`Received ${signal}, gracefully shutting down`);
    setTimeout(async () => {
      await rabbit.close();
      await sequelize.close();
      redis.quit();
      server.close(() => {
        logger.info('Server closed, exit.');
        process.exit(0);
      });
    }, 5000);
  });
});

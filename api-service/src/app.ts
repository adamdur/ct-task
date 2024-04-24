import sequelize from './services/sequelize';
import { json, urlencoded } from 'body-parser';
import api from './api/index';
import express, { Request, Response } from 'express';
import rabbit from './services/rabbit';
import logger from './logger';
require('dotenv').config();

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.get('/ready', async (req: Request, res: Response) => {
  try {
    await sequelize.authenticate();
    await rabbit.getConnection();
    res.status(200).json({
      status: 'success',
      message: 'All systems ready',
      timestamp: new Date(),
    });
  } catch (error: any) {
    logger.error(`Ready check failed: ${error}`);
    res.status(503).json({
      status: 'error',
      message: `Service Unavailable: ${error.message}`,
      timestamp: new Date(),
    });
  }
});

app.use('/api', api);

export default app;

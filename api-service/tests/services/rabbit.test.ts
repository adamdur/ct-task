import { Broker } from 'ct-common-lib';
import rabbitConfig from "../../src/config/rabbitConfig";
import logger from "../../src/logger";

jest.mock('ct-common-lib', () => ({
  Broker: {
    getInstance: jest.fn()
  }
}));
jest.mock('../../src/logger', () => ({
  info: jest.fn(),
  error: jest.fn()
}));
jest.mock('../../src/config/rabbitConfig', () => ({
  host: 'localhost',
  port: 5672
}));

describe('RabbitMQ Broker Instance', () => {
  it('should create a Broker instance using the singleton pattern', () => {
    const { default: rabbitInstance1 } = require('../../src/services/rabbit');
    const { default: rabbitInstance2 } = require('../../src/services/rabbit');

    expect(Broker.getInstance).toHaveBeenCalledTimes(1);
    expect(Broker.getInstance).toHaveBeenCalledWith(rabbitConfig, logger);

    expect(rabbitInstance1).toBe(rabbitInstance2);
  });

  it('should configure the Broker instance with specific configurations', () => {
    require('../../src/services/rabbit');
    expect(Broker.getInstance).toHaveBeenCalledWith(rabbitConfig, logger);
  });
});

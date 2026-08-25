import envConfig from './config/env.config.js';
import ServiceManager from './managers/ServiceManager.js';

const serviceManager = new ServiceManager();

console.log(`Application ready in ${envConfig.nodeEnv} mode on port ${envConfig.port}.`);
console.log(`Registered services: ${serviceManager.getServices().length}`);

export { serviceManager };

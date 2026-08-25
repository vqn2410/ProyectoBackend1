import dotenv from 'dotenv';

dotenv.config();

function validateEnv() {
  const requiredVariables = ['PORT', 'NODE_ENV'];
  const missingVariables = requiredVariables.filter((variable) => !process.env[variable]);

  if (missingVariables.length > 0) {
    console.error(`Faltan variables de entorno: ${missingVariables.join(', ')}`);
    process.exit(1);
  }

  const port = Number(process.env.PORT);

  if (Number.isNaN(port) || port < 1 || port > 65535) {
    console.error('PORT debe ser un numero entre 1 y 65535.');
    process.exit(1);
  }

  return {
    port,
    nodeEnv: process.env.NODE_ENV,
  };
}

const config = {
  ...validateEnv(),
};

export default config;

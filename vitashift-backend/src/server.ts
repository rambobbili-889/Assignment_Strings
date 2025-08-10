import mongoose from 'mongoose';
import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

async function connectMongo() {
  if (env.useMemoryDb) {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    logger.info('Connected to in-memory MongoDB');
    return;
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri);
  logger.info('Connected to MongoDB');
}

async function start() {
  try {
    await connectMongo();
    app.listen(env.port, () => {
      logger.info(`Server listening on port ${env.port}`);
    });
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
}

start();
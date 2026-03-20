import { MongoClient } from 'mongodb';

import type { ExpenseDocument } from '~~/server/types/expense';

let mongoClientPromise: Promise<MongoClient> | null = null;

export async function getMongoClient() {
  const config = useRuntimeConfig();

  if (!config.mongodbUri) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing MONGODB_URI server configuration.'
    });
  }

  if (!mongoClientPromise) {
    const client = new MongoClient(config.mongodbUri);
    mongoClientPromise = client.connect();
  }

  return mongoClientPromise;
}

export async function getExpensesCollection() {
  const config = useRuntimeConfig();
  const client = await getMongoClient();

  return client
    .db(config.mongodbDbName)
    .collection<ExpenseDocument>('expenses');
}

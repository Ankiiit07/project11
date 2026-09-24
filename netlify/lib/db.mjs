// Shared MongoDB connection for Netlify functions.
// The client is cached at module level so warm function invocations reuse it.

import { MongoClient } from 'mongodb';

let clientPromise = null;
let indexesReady = null;

export async function getDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');

  if (!clientPromise) {
    clientPromise = new MongoClient(uri, { maxPoolSize: 5 }).connect().catch((err) => {
      clientPromise = null; // let the next request retry
      throw err;
    });
  }
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || 'cafe-at-once');

  if (!indexesReady) {
    indexesReady = Promise.all([
      db.collection('orders').createIndex({ id: 1 }, { unique: true }),
      db.collection('orders').createIndex({ 'payment.paymentId': 1 }, { unique: true, sparse: true }),
      db.collection('orders').createIndex({ userId: 1, createdAt: -1 }),
      db.collection('orders').createIndex({ 'customer.email': 1, createdAt: -1 }),
    ]).catch((err) => {
      indexesReady = null;
      console.warn('db: index creation failed:', err.message);
    });
  }
  await indexesReady;
  return db;
}

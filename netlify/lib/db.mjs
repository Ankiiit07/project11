// Shared MongoDB connection for Netlify functions.
// The client is cached at module level so warm function invocations reuse it.

import { MongoClient } from 'mongodb';

let clientPromise = null;
let indexesReady = null;

export async function getDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');

  if (!clientPromise) {
    // Fail within 5s (Netlify stops functions at 10s) so a database problem shows up
    // as a clear error in the function log instead of a 504 timeout.
    clientPromise = new MongoClient(uri, { maxPoolSize: 5, serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000 })
      .connect()
      .catch((err) => {
        clientPromise = null; // let the next request retry
        console.error('db: could not connect to MongoDB. Check Atlas → Network Access allows 0.0.0.0/0 and the cluster is running:', err.message);
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
      db.collection('reviews').createIndex({ productId: 1, uid: 1 }, { unique: true }),
      db.collection('reviews').createIndex({ id: 1 }, { unique: true }),
      db.collection('reviews').createIndex({ productId: 1, status: 1, createdAt: -1 }),
    ]).catch((err) => {
      indexesReady = null;
      console.warn('db: index creation failed:', err.message);
    });
  }
  await indexesReady;
  return db;
}

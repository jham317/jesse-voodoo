const { MongoClient } = require('mongodb');
require('dotenv').config();
const { DB_URI } = process.env;

async function insertDataIntoCollection(collectionName, data) {
  const client = new MongoClient(DB_URI, { useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db();
    const collection = database.collection(collectionName);

    // Insert the data into the specified collection
    const result = await collection.insertMany(data);
    console.log(`Inserted ${result.insertedCount} documents into ${collectionName} collection`);
  } catch (error) {
    console.error(`Error inserting data into ${collectionName} collection:`, error);
    throw error;
  } finally {
    client.close();
    console.log('MongoDB connection closed');
  }
}

module.exports = { insertDataIntoCollection };

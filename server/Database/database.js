const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DB_URI;

async function connectToDatabase() {
  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const database = client.db('your-database-name'); // Replace with your actual database name

    console.log('Connected to the database successfully');

    return database;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

module.exports = { connectToDatabase };

const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
const clientPromise = mongoClient.connect();

const handler = async (event) => {
  try {
    const database = (await clientPromise).db(process.env.MONGO_DATABASE_MFLIX);
    const collection = database.collection('movies');

    if (event.httpMethod === 'POST') {
      const requestBody = JSON.parse(event.body);
      const result = await collection.insertOne(requestBody);
      return {
        statusCode: 200,
        body: JSON.stringify(result),
      };
    }

    return {
      statusCode: 400,
      body: 'Bad Request',
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error.toString(),
    };
  }
};

module.exports = { handler };

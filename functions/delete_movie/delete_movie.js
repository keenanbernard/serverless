const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
const clientPromise = mongoClient.connect();

const handler = async (event) => {
  try {
    const database = (await clientPromise).db(process.env.MONGO_DATABASE_MFLIX);
    const collection = database.collection('movies');

    if (event.httpMethod === 'POST') {
      const requestBody = JSON.parse(event.body);
      const objectID = new ObjectId(requestBody._id)

      // Use _id for precise document identification
      const result = await collection.deleteOne({ _id: objectID});

      if (result.deletedCount === 1) {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Document deleted successfully' }),
        };
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Document not found' }),
        };
      }
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error deleting document', error: error.toString() }),
    };
  }
};

module.exports = { handler };


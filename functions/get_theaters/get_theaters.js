const {MongoClient} = require("mongodb")
require('dotenv').config();

const mongoClient = new MongoClient(process.env.MONGO_URI)
const clientPromise = mongoClient.connect()

const handler = async () => {
  try {
    const database = (await clientPromise).db(process.env.MONGO_DATABASE_MFLIX)
    const collection = database.collection('theaters')
    const results = await collection.find({}).skip(0).limit(10).toArray();
    return {
      statusCode: 200,
      body: JSON.stringify(results)}

  } catch (error) {
    return {statusCode: 500, body: error.toString()}
  }

}

module.exports = {handler}
require('dotenv').config();
const { MongoClient } = require('mongodb');

async function main() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const aggCursor = client.db("sample_restaurants").collection("restaurants").aggregate([
      {
        '$match':  {
          cuisine: "Mexican",
          borough: "Manhattan",
        }
      }, 
      {
        '$project': {
          name: 1,
          averageScore: { $avg: "$grades.score"},
          address: 1
        }
      }, 
      {
        '$sort': {
          "averageScore": -1
        }
      }, 
      {
        '$limit': 10
      }
    ]);

    await aggCursor.forEach(restaurant => {
        console.log(`${restaurant.name}: ${restaurant.averageScore}`);
    });
  } finally {
      // Close the connection to the MongoDB cluster
      await client.close();
  }
}

main().catch(console.error);

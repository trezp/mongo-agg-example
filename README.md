# MongoDB Aggregation Pipeline 

## To run this project

```
git clone https://github.com/trezp/mongo-agg-example.git
```

Create a `.env` file and plug your Mongo URI into the `MONGO_URI` env variable

```
MONGO_URI="mongodb+srv://m001-student:<password>@sandbox.afhsh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority" 
```

Replace `<password>` with the password for the `m001-student` user and `myFirstDatabase` with the name of your database. 

Now you can install and  run the example: 

```
npm install
npm start
```

## What is aggregation with MongoDB, and how does it differ from a regular query? 

A MongoDB query helps you narrow down your data:  

find() - Find all restaurants serving Chinese cuisine in the borough of Manhattan, with a 
score greater than or equal to 30:  

```
db.restaurants.find({cuisine: "Mexican", borough: "Manhattan", "grades.score": {$gte: 30}})
```

Aggregation helps you _transform_ your data: 

aggregate() - Calculate the average score of restaurants serving Mexican cuisine in Manhattan, and rank the top ten based on that average score.

```
db.restaurants.aggregate([
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
      address: 1,
      borough: 1
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
```

## Aggregation Pipeline and Stages 

The array in the above code sample is called a `pipeline`, and pipelines are made of `stages` that your data flows through. Common stages include `$match` and `$project`. See [the docs](https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/) for more stages. 

The `$match` stage is essentially a filter. In the following example, we match all documents with a cuisine of "Mexican" and a borough of "Manhattan". Only these documents are sent to the next stage in the pipeline.  

```
'$match':  {
  cuisine: "Mexican",
  borough: "Manhattan"
}
```

In the `$project` stage, we can give our data a new shape. Define a new document using `1` to include fields or `0` to exclude fields, or define and calculate new fields. 

In the following example, `$grades.score` represents each score in an array of scores in each restaurant document. We can create a new field called `averageScore` and use `$avg` on the `$grades` array to get the average score for each restaurant document. 

```
'$project': {
  name: 1,
  averageScore: { $avg: "$grades.score"},
  address: 1,
  borough: 1
}
```
averageScore: { $round: { $avg: "$grades.score"}}

Let's use the `$round` operator to round the average scores to the first decimal place. `$round` can take a single value or an array with the value and number of decimal places: 

```
'$project': {
  name: 1,
  averageScore: { 
    $round: [{ $avg: "$grades.score" }, 1]
  }
  address: 1,
  borough: 1
}
```

Using our newly created `averageScore` field, we can use a `$sort` stage to sort the Manhattan restaurants in descending order: 

```
'$sort': {
  "averageScore": -1
}
```

Finally we can limit the number of documents to the top ten scoring restaurants: 

```
{
  '$limit': 10
}
```

# Assignment 

You can complete the activity by cloning this repo (see instructions above) and connecting to the app or using Compass. 

## Experiment
Spend a few minutes playing with the example in `app.js` or by plugging the values into Compass
- Find the ten highest scored restaurants: 
  - In a different borough 
  - Of a different cuisine 
- Print the 10 lowest scored restaurants serving American cuisine 
- Print the 10 highest score restaurants serving Chinese cuisine 

## Create your own aggregation 
Using the `sample_mflix` database and `movies` collection, write an aggregation to create a list of the 10 longest movies with the genre “fantasy”: 

- Stage 1 `$match`: Find all movies with the genre “fantasy” 
- Stage 2 `$project`: 
  - Create a new collection with the `name`, `genre` and `runtime` of each fantasy movie
  - Create a new field called `runtime_in_hours` that calculates the runtime in hours.
    - `$divide` the runtime minutes by 60
    - `$round` the runtime to hours
- Stage 3 `$sort`: Sort the list from highest to lowest using `runtime_in_hours`
- Stage 4 `$limit`: Limit the results to 10 


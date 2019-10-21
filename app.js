const express = require("express");
const bodyParser = require("body-parser");
const graphHttp = require("express-graphql");
const mongoose = require("mongoose");
const isAuth = require("./middleware/is-auth");
require("dotenv").config();
const app = express();

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolver = require("./graphql/resolvers/index");

const events = [];

//MIDDLEWARE
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
//validate incoming request

app.use(isAuth);
// we can not use isAuth for the route we want because
// graphql only has one route so that we will use (protect)
// the route in every resolver
app.use(
  "/graphql",
  graphHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolver,
    graphiql: true
  })
);
//START DB AND SERVER
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-oyvfx.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true
    }
  )
  .then(() => {
    console.log("Connected");
    //START SERVER
    app.listen(process.env.port || 8000);
  })
  .catch(err => {
    console.log(err);
  });

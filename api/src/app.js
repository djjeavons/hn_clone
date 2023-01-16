const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const typeDef = require("./schema");
const resolvers = require("./resolvers");

const app = express();

app.use(
  `/${process.env.API_ENDPOINT}`,
  graphqlHTTP({
    schema: typeDef,
    rootValue: resolvers,
    graphiql: true,
  })
);

app.listen(process.env.API_PORT);
console.log(
  `Server running at http://localhost:${process.env.API_PORT}/${process.env.API_ENDPOINT}`
);

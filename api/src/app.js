const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema");

const app = express();

app.use(
  `/${process.env.API_ENDPOINT}`,
  graphqlHTTP({
    schema: schema,
    graphiql: true,
    pretty: true,
  })
);

app.listen(process.env.API_PORT, () => {
  console.log(
    `🚀 Server listening at http://localhost/${process.env.API_ENDPOINT}:${process.env.API_PORT} 🚀`
  );
});

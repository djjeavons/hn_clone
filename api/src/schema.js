// TODO:
// 1. Add relationship between Item and Comment
// 2. Resolve Item and Comment
// 3. Look at recursive routine for resolving all comments for an Item including sub comments
const graphql = require("graphql");
const { itemType } = require("./types/itemType");
const { commentType } = require("./types/commentType");
const { getItem } = require("./lib/dal/item");

const { GraphQLObjectType, GraphQLSchema, GraphQLInt } = graphql;

const RootQuery = new GraphQLObjectType({
  name: "HackerNewsQuery",
  description: "Query the Hacker News database",
  fields: {
    item: {
      type: itemType,
      args: {
        id: {
          type: GraphQLInt,
          description: "The unique identifier of the item to retrieve.",
          require: true,
        },
      },
      async resolve(parent, args) {
        return await getItem(args.id);
      },
    },
    comment: {
      type: commentType,
      resolve(parent, args) {
        return { id: 999, text: "comment test" };
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});

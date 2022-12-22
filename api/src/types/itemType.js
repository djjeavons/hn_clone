const graphql = require("graphql");

const { GraphQLObjectType, GraphQLInt, GraphQLBoolean, GraphQLString } =
  graphql;

const ItemType = new GraphQLObjectType({
  name: "Item",
  description:
    "An item represents a Story, Ask, Show, or Job from Hacker News.",
  fields: () => ({
    id: {
      type: GraphQLInt,
      description: "The unique identifier of this item.",
    },
    deleted: {
      type: GraphQLBoolean,
      description: "True if the item has been deleted.",
    },
    type: {
      type: GraphQLString,
      description: "The type of item, such as, Story, Show, Job etc.",
    },
    by: { type: GraphQLString, description: "The name of the author." },
    text: { type: GraphQLString, description: "The main body of this item." },
    dead: { type: GraphQLBoolean, description: "True if the item is dead." },
    parent: {
      type: GraphQLInt,
      description:
        "The identifier of the items parent. Particularly useful for comments",
    },
    url: { type: GraphQLString, description: "The URL of the story." },
    score: { type: GraphQLInt, description: "The items score or votes" },
    title: { type: GraphQLString, description: "The title of the item." },
    descendants: { type: GraphQLInt, description: "The total comment count." },
    time: {
      type: GraphQLInt,
      description: "Creation date of the item stored in unix time.",
    },
  }),
});

exports.itemType = ItemType;

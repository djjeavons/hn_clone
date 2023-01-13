const graphql = require("graphql");

const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } = graphql;

const CommentType = new GraphQLObjectType({
  name: "Comment",
  description: "A user comment.",
  fields: () => ({
    id: {
      type: GraphQLInt,
      description: "The unique identifier of this comment.",
    },
    by: { type: GraphQLString, description: "The author of this comment." },
    parentId: {
      type: GraphQLInt,
      description:
        "The unique identifier of the parent of this comment, either another comment or a story.",
    },
    text: { type: GraphQLString, description: "The body of the comment." },
    time: {
      type: GraphQLInt,
      description: "The create date of the comment stored in unix time.",
    },
    type: { type: GraphQLString, description: "The type of this comment." },
    parentType: {
      type: GraphQLString,
      description:
        "The parent type of this comment, could be a comment, story, job, show etc.",
    },
    comments: {
      type: GraphQLList(CommentType),
      description: "The comments associated with this comment.",
    },
  }),
});

exports.commentType = CommentType;

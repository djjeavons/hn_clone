const { buildSchema } = require("graphql");

const typeDef = buildSchema(`#graphql
  """ An item represents a Story, Ask, Show, or Job from Hacker News. """
  type Item {
    """ The unique identifier of this item. """
    id: Int!
    """ True if the item has been deleted. """
    deleted: Boolean
    """ The type of item, such as Story, Job, Poll. """
    type: String
    """ The name of the author. """
    by: String
    """ The main body of the item. """
    text: String
    """ True if the item is dead. """
    dead: Boolean
    """ The identifier of the items parent. Particularly useful for comments. """
    parent: Int
    """ The URL of the story. """
    url: String
    """ The items score or votes. """
    score: Int
    """ The title of the item. """
    title: String
    """ The total comment count. """
    descendants: Int
    """ Creation date of the item stored in unix time. """
    time: Int
    """ Comments associated with this item. """
    comments: [Comment]
  }

  """ A user comment """
  type Comment {
      """ The unique identifier of this item. """
      id: Int!
      """ The author of this comment. """
      by: String 
      """ The unique identifier of the parent of this comment, either another comment or a story. """
      parentId: Int
      """ The body of the comment. """
      text: String
      """ The creation date of the comment stored in unix time. """
      time: Int
      """ The type of this comment. """
      type: String
      """ The parent type of this comment, could be a comment, story, job or poll. """
      parentType: String
      """ Comments associated with this comment. """
      comments: [Comment]
  }

  """ Available queries that can be executed against the Hacker News database """
  type Query {
    getItem(id: Int!): Item
    getItems(limit: Int, offset: Int): [Item]
  }
`);

module.exports = typeDef;

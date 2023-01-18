const { getItem, getItems } = require("./lib/dal/item");

const resolvers = {
  getItem: ({ id }) => resolveGetItem(id),
  getItems: ({ limit, offset }) => resolveGetItems(limit, offset),
};

async function resolveGetItem(id) {
  return await getItem(id);
}

async function resolveGetItems(limit, offset) {
  return await getItems(limit, offset);
}

module.exports = resolvers;

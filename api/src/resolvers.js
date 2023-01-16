const { getItem } = require("./lib/dal/item");

const resolvers = {
  getItem: ({ id }) => resolveItem(id),
};

async function resolveItem(id) {
  return await getItem(id);
}

module.exports = resolvers;

const authResolver = require("./auth");
const bookingResolver = require("./booking");
const enventResolver = require("./event");

const rootResolver = {
  ...authResolver,
  ...bookingResolver,
  ...enventResolver
};

module.exports = rootResolver;

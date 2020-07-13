
exports.up = function(knex) {
  return knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
};

exports.down = function(knex) {
  return knex.schema.raw('DROP EXTENSION IF EXISTS "uuid-ossp"')
};

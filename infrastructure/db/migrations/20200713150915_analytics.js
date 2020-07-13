
exports.up = function(knex) {
  return knex.schema.createTable('analytic_events', table => {
    table.uuid('id')
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    
    table.jsonb('event')
      .notNullable()
    
    table.timestamp('created_at')
      .notNullable()
      .defaultTo(knex.raw('NOW()'))
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('analytic_events')
};

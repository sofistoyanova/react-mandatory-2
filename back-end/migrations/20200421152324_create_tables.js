
exports.up = function(knex) {
  return knex.schema
    .createTable('users', (table) => {
        table.increments('id')
        table.string('username').unique(),
        table.string('email').unique()
        table.string('password')
        table.string('first_name')
        table.string('last_name')
        table.timestamp('created_at').defaultTo(knex.fn.now())
    })
    .createTable('addresses', (table) => {
        table.increments('id')
        table.string('address_1')
        table.string('address_2')
        table.string('postal_code')
        table.string('city')
        table.integer('user_id').unsigned().notNullable()
        table.foreign('user_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE')
    })
    .createTable('forgot-password', (table) => {
      table.increments('id')
      table.string('email').notNullable()
      table.string('token').notNullable()
      table.foreign('email').references('users.email').onDelete('CASCADE')
    })
};

exports.down = function(knex) {
  return knex.schema
  .dropTableIfExists('forgot-password')
    .dropTableIfExists('addresses')
    .dropTableIfExists('users')
};

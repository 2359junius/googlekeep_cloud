exports.up = function(knex, Promise) {
  return knex.schema.createTable('user', function(userTable) {
      // Primary Key
      userTable.increments('id').primary()
      // Data
      userTable.string('username', 50).notNullable().unique()
      userTable.string('email', 250).notNullable().unique()
      userTable.string('password', 128).notNullable()
      
      userTable.timestamp('created_at').notNullable();
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('user')
};

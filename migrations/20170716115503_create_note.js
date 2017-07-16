
exports.up = function(knex, Promise) {
    return knex.schema.createTable('note', function(noteTable) {
        // Primary Key
        noteTable.increments('id').primary()
        // Foreign Key
        noteTable.integer('owner').unsigned().references('id').inTable('user')
        // Data
        noteTable.string('title', 250).notNullable()
        noteTable.string('description', 250)
        
        noteTable.timestamp('created_at').notNullable();
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('note')
};

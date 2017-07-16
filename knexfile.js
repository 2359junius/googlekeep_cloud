module.exports = {
    development: {
        migrations: {tableName: 'knex_migrations'},
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: 'Juniusmedia',
            database: 'googlekeepdb',
            charset: 'utf8'
        }
    }
}
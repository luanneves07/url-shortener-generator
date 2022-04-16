const knex = require('knex')({
    client: 'pg',
    debug: false,
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    }
});

module.exports = {
    findAllShortenedUrls: () => knex.select('shortened_url').from('urls'),
}
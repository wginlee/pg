var args = process.argv;

const settings = require("./settings"); // settings.json

const pg = require("knex")({
  client: 'pg',
  connection: {
    user     : settings.user,
    password : settings.password,
    database : settings.database,
    host     : settings.hostname,
    port     : settings.port,
    ssl      : settings.ssl
  },
  searchPath: 'knex,public'
});

pg('famous_people').insert({
    first_name: args[2],
    last_name: args[3],
    birthdate: args[4]
  }).finally(function() {
  pg.destroy();
});
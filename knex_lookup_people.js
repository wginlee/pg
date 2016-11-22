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

pg.select('id', 'first_name', 'last_name', 'birthdate')
  .from('famous_people')
  .where('first_name', args[2])
  .orWhere('last_name', args[2])
  .on('query', function(){
    console.log("Searching...");
  })
  .on('query-error', function(err){
    console.error("error running query", err);
  })
  .then( (rows) => {
  console.log("Found", rows.length, "person(s) by the name", args[2]);
    for (var row in rows){
      console.log(rows[row].id, ":", rows[row].first_name, rows[row].last_name, ", born", rows[row].birthdate.toDateString());
    }
  })
  .finally(function() {
  pg.destroy();
});


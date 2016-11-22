var args = process.argv;

const pg = require("pg");
const settings = require("./settings"); // settings.json

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

function queryDb(sql, params, callback){
  client.connect((err) => {
    if (err) return console.error("error connecting to database", err);
    client.query(sql, params, (err, result) => {
      if (err) return callback(err);
      callback(null, result);
      client.end((err) => {
        if (err) throw err;
      });
    });
  });
}

queryDb("SELECT id, first_name, last_name, birthdate FROM famous_people WHERE first_name = $1::text OR last_name = $1::text", [args[2]], (err, result) => {
  if (err) {
    return console.error("error running query", err);
  }
  console.log("Searching...");
  console.log("Found", result.rows.length, "person(s) by the name", args[2]);
  for (var row in result.rows){
    console.log(result.rows[row].id, ":", result.rows[row].first_name, result.rows[row].last_name, ", born", result.rows[row].birthdate.toDateString());
  }
});

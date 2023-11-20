const {Client} = require('pg');

let db = new Client({connectionString : "postgressql:///helpdeskdb"});

db.connect();

module.exports = db
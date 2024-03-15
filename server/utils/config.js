///--------------------------------------------
//Title: config.js
//Author: Kyle Hochdoerfer
//Date: 03/14/24
//Description: MongoDB Configuration file for Web Dev Grill
//---------------------------------------------

//Enable strict mode
"use strict"

//Create a db object with the database's username, password, and name
const db = {
  username: "wdg_user",
  password: "s3cret",
  name: "webdevgrill"
}

//Create a config object with the port, connecting string, and db name
const config = {
  port: 3000,
  dbUrl: `mongodb+srv://${db.username}:${db.password}@cluster0.tydee4p.mongodb.net/${db.name}?retryWrites=true&w=majority`,
  dbname: db.name
}

//Export the module
module.exports = config;
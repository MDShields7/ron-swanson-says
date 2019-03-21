const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const massive = require("massive");
require("dotenv").config();
const app = express();


massive(process.env.CONNECTION_STRING)
  .then(database => {
    app.set("db", database);
  })
  .catch(error => {
    console.log("error with massive", error);
  });

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../build`));
app.use(session({
  // secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  maxAge: 1000 * 60 * 60 * 24 * 14
}));

app.get("/api/visitor/check", (req, res) => {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(ip);
})
app.post("/api/visitor/register", (req, res) => {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
})

app.get("/api/quote/check", (req, res) => {
  const dbInstance = req.app.get('db');
  dbInstance.check({ user_name: user_name })

});
app.post("/api/quote/register", (req, res) => {
  const dbInstance = req.app.get('db');
  dbInstance.register({ user_name: user_name })

});


const path = require("path");
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

const PORT = 4000 || process.env.CONNECTION_STRING;
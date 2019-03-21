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
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  maxAge: 1000 * 60 * 60 * 24 * 14
}));

app.get("/api/quote/check", (req, res) => {
  const dbInstance = req.app.get('db');
  const { saying, type } = req.query;
  console.log('CHECK QUOTE starting, saying, type:', saying, type)
  dbInstance.get_quote([saying])
    .then(response => {
      console.log('response', response)
      res.json(response);
    })
    .catch(error => {
      res.status(500).json({ message: 'check quote error:', error })
    })
});
app.post("/api/quote/register", (req, res) => {
  const dbInstance = req.app.get('db');
  const { saying, type } = req.body;
  console.log('REGISTER QUOTE starting, quote:', saying, type)
  dbInstance.register_quote([saying, type])
    .then(response => {
      console.log('check quote, res:', response)
      res.json(response);
    })
    .catch(error => {
      res.status(500).json({ message: 'register quote error:', error })
    })
});
app.get("/api/visitor/check", (req, res) => {
  if (req.session.user === undefined) {
    const dbInstance = req.app.get('db');
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('CHECK VISITOR, session not found in store, check db with ip:', ip)
    dbInstance.get_user([ip])
      .then(users => {
        if (users[0] === undefined) {
          console.log('CHECK VISITOR, user not found in db')
          res.json('');
        } else {
          console.log('CHECK VISITOR, user found in db, sending')
          req.session.user = users[0];
          res.json(users[0]);
        }
      })
      .catch(error => {
        if (res !== []) {
          res.status(500).json({ message: 'check quote error:', error })
        }
      })
  } else {
    console.log('CHECK VISITOR, session found in store, sending')
    res.json(req.session.user)
  }
});
app.post("/api/visitor/register", (req, res) => {
  const dbInstance = req.app.get('db');
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('register visitor, ip:', ip)
  dbInstance.register_user([ip])
    .then(() => {
      req.session.user = { rs_u_ip: ip };
      console.log('VISITOR REGISTERED, req.session.user:', req.session.user)
      res.json(req.session.user);
    })
    .catch(error => {
      res.status(500).json({ message: 'register visitor error:', error })
    })
})

function checkSize(item, type) {
  let size = array[i]['saying'].length;
  if (type = 'small') {
    if (5 > size) {
      return true;
    }
  } else if (type = 'medium') {
    if (12 >= size && size >= 5) {
      return true;
    }
  } else if (type = 'large') {
    if (12 < size) {
      return true;
    }
  }
}
function loopThruResults(array, type) {
  let newArr = []
  for (let i = 0; i < array.length; i++) {
    if (checkSize(array[i], type)) {
      newArr.push(array[i])
    }
  }
  console.log(newArr);

}

const path = require("path");
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

const PORT = 8000 || process.env.CONNECTION_STRING;
app.listen(PORT, () => {
  console.log(`Tuning into Port ${PORT} 📡`);
});
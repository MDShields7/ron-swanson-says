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
          req.session.user = { id: users[0].rs_u_id, ip: users[0].rs_u_ip };
          console.log('req.session.user', req.session.user)
          res.json(req.session.user);
        }
      })
      .catch(error => {
        if (res !== []) {
          res.status(500).json({ message: 'check quote error:', error })
        }
      })
  } else {
    console.log('CHECK VISITOR, session found in store, sending')
    console.log('req.session.user', req.session.user)
    res.json(req.session.user)
  }
});
app.post("/api/visitor/register", (req, res) => {
  const dbInstance = req.app.get('db');
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('register visitor, ip:', ip)
  dbInstance.register_user([ip])
    .then(users => {
      console.log('users', users)
      req.session.user = { id: users[0].rs_u_id, ip: users[0].rs_u_ip };
      console.log('VISITOR REGISTERED, req.session.user:', req.session.user)
      res.json(req.session.user);
    })
    .catch(error => {
      res.status(500).json({ message: 'register visitor error:', error })
    })
})
app.get("/api/quote/getById", (req, res) => {
  const dbInstance = req.app.get('db');
  const { id } = req.query;
  console.log('CHECK QUOTE starting, id:', id)
  dbInstance.get_quote_by_id([id])
    .then(response => {
      console.log('CHECK QUOTE response', response)
      res.json(response);
    })
    .catch(error => {
      res.status(500).json({ message: 'check quote error:', error })
    })
});
app.get("/api/quote/check", (req, res) => {
  const dbInstance = req.app.get('db');
  const { saying, type } = req.query;
  console.log('CHECK QUOTE starting, saying, type:', saying, type)
  dbInstance.get_quote([saying])
    .then(response => {
      console.log('CHECK QUOTE response', response)
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
app.get("/api/ratings/get", (req, res) => {
  const dbInstance = req.app.get('db');
  const { id } = req.query;
  console.log('GET RATINGS starting, quote id:', id)
  dbInstance.get_ratings([id])
    .then(ratings => {
      console.log('GET RATINGS ratings', ratings)
      res.json(ratings);
    })
    .catch(error => {
      res.status(500).json({ message: 'check quote error:', error })
    })
});
app.get("/api/myRating/get", (req, res) => {
  const dbInstance = req.app.get('db');
  const { quoteId, userId } = req.query;
  console.log('GET MY RATING starting, quoteId:', quoteId, 'userId', userId)
  dbInstance.get_my_rating([quoteId, userId])
    .then(rating => {
      console.log('GET MY RATING ratings', rating)
      res.json(rating);
    })
    .catch(error => {
      res.status(500).json({ message: 'check quote error:', error })
    })
});
app.post('/api/rating/post', (req, res) => {
  const dbInstance = req.app.get('db');
  const { quoteId, userId, rating } = req.body;
  console.log('REGISTER RATINGS starting, quoteId:', quoteId, 'userId', userId, 'rating', rating)
  dbInstance.register_rating([userId, quoteId, rating])
    .then(rating => {
      console.log('REGISTER RATING ratings', rating)
      res.json(rating);
    })
    .catch(error => {
      res.status(500).json({ message: 'register rating error:', error })
    })
});

const path = require("path");
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

const PORT = 8000 || process.env.CONNECTION_STRING;
app.listen(PORT, () => {
  console.log(`Tuning into Port ${PORT} 📡`);
});
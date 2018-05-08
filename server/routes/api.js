const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const db = "mongodb://userlody:123456@ds217560.mlab.com:17560/feedsdb";
mongoose.connect(db, err => {
  if (err) {
    console.error(`Error: ${err}`);
  }
  else {
    console.log(`Connect to mongoDB database`);
    }
});

router.get('/', (req, res) => {
  res.send("From API route");
});

router.post('/register', (req, res) => {
  let userData = req.body;
  let user = new User(userData);
  user.save((error, registeredUser) => {
    if (error) {
      console.error(error);
    }
    else {
      let payload = { subject: registeredUser.id };
      let token = (payload, 'secret key');
      res.status(200).send({token});
    }
  });
});

router.post('/reset-password', (req, res) => {
  let userData = req.body;
  User.findOne({email: userData.email}, (error, user) => {
    if (error) {
      console.error(error);
    }
    else {
      if (!user) {
        res.status(401).send("There is no user with such email");
      }
      else {
          user.password = userData.password;
          user.save();
          res.status(200).send("Password reseted");
        // if (user.password !== userData.password) {
        //   res.status(401).send("Invalid password");
        // }
        // else {
        //   let payload = { subject: user.id };
        //   let token = jwt.sign(payload, 'secret key');
        //   res.status(200).send({token});
        // }
      }
    }
  });
});

router.post('/login', (req, res) => {
  let userData = req.body;
  User.findOne({email: userData.email}, (error, user) => {
    if (error) {
      console.error(error);
    }
    else {
      if (!user) {
        res.status(401).send("Invalid email");
      }
      else {
        if (user.password !== userData.password) {
          res.status(401).send("Invalid password");
        }
        else {
          let payload = { subject: user.id };
          let token = jwt.sign(payload, 'secret key');
          res.status(200).send({token});
        }
      }
    }
  });
});

router.get('/feeds', (req, res) => {
  let feeds = [
    {
      "id": "1",
      "name": "Job Dating",
      "description": "find the job of my life"
    },
    {
      "id": "2",
      "name": "Meetup",
      "description": "lorem ipsum"
    },
    {
      "id": "3",
      "name": "Clasico Real - Barcelona",
      "description": "Messi is the god"
    },
    {
      "id": "4",
      "name": "Last episode of dragon ball super",
      "description": "My goodness, no wayyyyy!!!"
    }
  ];
  res.json(feeds);
});
module.exports = router;

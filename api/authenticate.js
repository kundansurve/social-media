const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Post = require("./../models/post");
const Auth = require("./../models/auth");
const Comment = require("./../models/comments");
const User = require("./../models/user");
const bcrypt = require('bcryptjs');

router.post("/", (req, res) => {

  const { email, password } = req.body;
  if (!email || !password) {
    res.json({
      error: "Please provide email and password",
    });
    return;
  }
  const userName = email.split("@")[0];
  Auth.findOne({
    userName: userName,
  })
    .then((data) => {
      if (data) {
        const hash = bcrypt.hashSync(password);
        if(hash!==data.password){
            res.json({error:"Invalid Password"});
            return;
        }
        jwt.sign(
            {
              userName,
            },
            "secret",
            { expiresIn: 60 * 60 },
            (err, token) => {
              res.json({ token });
            }
          );
        return;
      }
      const hash = bcrypt.hashSync(password);

      const auth = new Auth({ email, password:hash, userName });
      auth
        .save()
        .then(() => {
          const user = new User({
            email, userName
          });
          user
            .save()
            .then(() => {
              jwt.sign(
                {
                  userName,
                },
                "secret",
                { expiresIn: 60 * 60 },
                (err, token) => {
                  res.json({ token });
                }
              );
            })
            .catch((error) => {
              res.json({ error: error });
            });
        })
        .catch((error) => {
          res.json({ error: error });
        });
    })
    .catch((error) => {
      res.json({ error: error });
    });
});

module.exports = router;

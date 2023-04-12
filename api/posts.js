const express = require("express");
const router = express.Router();
const Post = require("./../models/post");
const mongoose = require("mongoose");

router.post("/", (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    res.json({ error: "Title and description must be provided" });
    return;
  }
  const id = new mongoose.Types.ObjectId().toHexString();
  const createdAt = Date.now();
  const post = new Post({
    _id: id,
    postBy: req.userName,
    title,
    description,
    likes:[],
    createdAt: createdAt,
  });
  post
    .save()
    .then(() => {
      res.json({ _id: id, title, description, createdAt: createdAt });
    })
    .catch((err) => {
      res.json({ error: err });
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  Post.findOne({ _id: id }).then((data) => {
    if (!data) {
      res.json({ error: "Post not found" });
      return;
    }
    if (data.postBy !== req.userName) {
      res.json({ error: "You cannot delete this post" });
      return;
    }
    Post.deleteOne({ _id: id })
      .then(() => {
        res.json({ success: "Post deleted successfully" });
      })
      .catch((err) => {
        res.json({ error: err });
      });
  });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  Post.findOne({ _id: id })
    .then((data) => {
      if (data) {
        res.json({id:data._id,totalLikes:data.likes.length,totalComments:data.comments});
      } else {
        res.json({ error: "Post not found" });
      }
    })
    .catch((err) => {
      res.json({ error: err });
    });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Post = require("./../models/post");
const Comment = require("./../models/comments");
const mongoose = require("mongoose");

router.post("/:id", (req, res) => {
  const { comment } = req.body;
  const id = req.params.id;
  const commentId = new mongoose.Types.ObjectId().toHexString();
  const comm = new Comment({
    _id: commentId,
    commentedBy: req.userName,
    onPost: id,
    comment,
  });
  comm
    .save()
    .then(() => {
        Post.updateOne({_id:id},{$inc:{comments:1}}).then(()=>{
            res.json({ sucess: "comment added successfully", id: commentId });       
        }).catch((err) => {
            res.json({ error: err });
          });
    })
    .catch((err) => {
      res.json({ error: err });
    });
});

module.exports = router;

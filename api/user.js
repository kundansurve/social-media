const express = require('express');
const router = express.Router();
const User = require('./../models/user');

router.get('/',(req,res)=>{
    User.findOne({userName: req.userName})
    .then((userData)=>{
        res.json({userName:userData.userName,totalFollowers:userData.followers.length,totalFollowing:userData.following.length});
    }).catch(error=>{
        res.json({
            error:error
        })
    });
});

module.exports = router;
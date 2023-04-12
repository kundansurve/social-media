const express = require('express');
const router = express.Router();
const userPathApi = require ('./user');
const {verifyToken} = require("./../middleware/verifytoken");
const authenticateApi = require("./authenticate");
const postPathAPi = require('./posts');
const Post = require("./../models/post");
const commentPathApi = require("./comment");
const User = require("./../models/user");
const mongoose = require("mongoose");

router.use(express.json());
router.use(express.urlencoded({ extended: true })); 

router.use('/authenticate',authenticateApi);

router.use('/user',verifyToken,userPathApi);

router.use('/posts',verifyToken,postPathAPi);

router.use('/comment',verifyToken,commentPathApi);

router.post('/follow/:id',verifyToken,(req,res)=>{
    const id= req.params.id;
    if(id===req.userName){
        res.json("Sorry you cannot follow yourself");
        return;
    }
    User.findOne({userName:id}).then(data=>{
        if(!data){
            res.json({error:"No user with this username"});
            return;
        }
        if(data.followers.includes(req.userName)){
            res.json({error:"You already follow this username or id"});
            return;
        }
        User.updateOne({ userName: id },
            { $push: { followers: req.userName } }
        ).then(()=>{
            User.updateOne({ userName: req.params.id },
                { $push: { following: req.userName } }
            ).then(()=>{
                res.json({success:"Successfully followed"})
            }).catch(err=>{
                res.json({error:err});
                return;
            })
        }).catch(err=>{
            res.json({error:err});
            return;
        })
    }).catch(err=>{
        res.json({error:err});
        return;
    })
})

router.post('/unfollow/:id',verifyToken,(req,res)=>{
    const id= req.params.id;
    User.findOne({_id:id}).then(data=>{
        if(!data){
            res.json({error:"No user with this username"});
            return;
        }
        if(!data.followers.includes(req.userName)){
            res.json({error:"You don't follow this user"});
            return;
        }
        User.updateOne({ _id: id },
            { $pull: { followers: req.username } }
        ).then(()=>{
            User.updateOne({ _id: req.params.id },
                { $pull: { following: req.username } }
            ).then(()=>{
                res.json({success:"Successfully followed"})
            }).catch(err=>{
                res.json({error:err});
                return;
            })
        }).catch(err=>{
            res.json({error:err});
            return;
        })
    }).catch(err=>{
        res.json({error:err});
        return;
    })
})

router.post('/like/:id',verifyToken, (req,res)=>{
    const id= req.params.id;
    Post.findOne({_id:id}).then((data)=>{
        if(!data){
            res.json({error:"Post not found"})
            return;
        }
        if(data.likes.includes(req.userName)){
            res.json({error:"Post is already Liked"});
            return;
        }
        console.log(data);
        Post.updateOne(
            { _id: id },
            { $push: { likes: req.userName } }
         ).then(()=>{
            res.json({succes:"You liked this post"});
         }).catch(err=>{
            res.json({error:err})
        })
    }).catch(err=>{
        res.json({error:err})
    })
})

router.post('/unlike/:id',verifyToken, (req,res)=>{
    const id= req.params.id;
    Post.findOne({_id:id}).then((data)=>{
        if(!data){
            res.json({error:"Post not found"})
            return;
        }
        if(!data.likes.includes(req.userName)){
            res.json({error:"Post haven't been liked yet."});
            return;
        }
        Post.updateOne(
            { _id: id },
            { $pull: { likes: req.userName } }
         ).then(()=>{
            res.json({succes:"You unliked this post"});
         }).catch(err=>{
            res.json({error:err})
        })
    }).catch(err=>{
        res.json({error:err})
    })
})

router.get("/all_posts",verifyToken,(req,res)=>{
    Post.find({postBy:req.username}).then(allPosts=>{
        if(!allPosts){
            res.json({error:"No posts yet"})
        }
        const postIds = [];
        for(let post of allPosts){
            postIds.push(post._id);
        }
        const responseData = {};
        Comment.find({onPost:{
            $any:postIds
        }}).then((allComments)=>{
            for(let j=0;j<allPosts.length;j++){
                const comments = [];
                for(let i=0;i<allComments.length;i++){
                    if(allPosts[j]._id===allComments[i].onPost){
                        comments.push(allComments[i]);
                    }
                }
                responseData.push({id:allPosts[j]._id,comments:comments,title:allPosts[j].title,description:allPosts[j].description,created_at:allPosts[j].createdAt,likes:allPosts[j].likes.length});
            }
            res.json(responseData);
        }).catch(err=>{
            res.json({error:err});
        })
    }).catch(err=>{
        res.json({error:err});
    })
})

module.exports = router;

const express = require('express');
const USER = require('../models/user');
const router = express.Router();
const POST = require('../models/post');
const requireLogin = require('../middleware/auth');


router.get('/', async (req, res) => {

    try {

        if (!req.session.userId) {
            return res.redirect('/login');
        }


        // Current user
        const user = await USER.findById(
            req.session.userId
        );


        if (!user) {
            return res.redirect('/login');
        }


        // IDs of people I follow
        const followingIds = user.following;


        // Include myself too
        const feedUserIds = [
            user._id,
            ...followingIds
        ];


        // Get posts from myself + people I follow
        const posts = await POST.find({
            author: {
                // Give me posts whose author is one of these IDs.
                $in: feedUserIds
            }
        })
        .populate('author')
        .sort({
            createdAt: -1
        });


        return res.render('home', {
            user,
            posts
        });


    } catch (error) {

        console.error(error);

        return res.status(500).send(
            'Something went wrong'
        );

    }

});

router.get('/signup',(req,res)=>{
    return res.render('signup');
});

router.get('/login' , (req,res)=>{
    return res.render('login')
});

router.get('/profile', async (req, res) => {

    try {

        // 1. Get currently logged-in user
        // const user = await USER.findById(req.session.userId);

        // if (!user) {
        //     return res.redirect('/login');
        // }


        // // 2. VERY IMPORTANT:
        // // Only get posts belonging to THIS user
        // const posts = await POST.find({
        //     author: user._id
        // })
        // .populate('author')
        // .sort({ createdAt: -1 });


        // console.log("Logged in user:");
        // console.log(user._id, user.username);

        // console.log("Posts belonging to this user:");

        // posts.forEach(post => {
        //     console.log(
        //         post._id,
        //         post.author,
        //         post.content
        //     );
        // });
        console.log("SESSION USER ID:", req.session.userId);

const user = await USER.findById(req.session.userId);

console.log("CURRENT USER:", user._id);
console.log("CURRENT USERNAME:", user.username);

const posts = await POST.find({
    author: user._id
});

console.log("NUMBER OF POSTS:", posts.length);

posts.forEach(post => {
    console.log(
        "POST AUTHOR:",
        post.author,
        "| CONTENT:",
        post.content
    );
});

        return res.render('profile', {
            user,
            posts
        });

    } catch (error) {

        console.error(error);

        return res.status(500).send(
            'Something went wrong'
        );

    }

});


module.exports = router
const POST = require('../models/post');

async function createPost(req, res) {

    try {

        if (!req.session.userId) {
            return res.status(401).json({
                error: 'You must be logged in'
            });
        }

        const {
            content,
            replyPermission
        } = req.body;


        if (!content || !content.trim()) {
            return res.status(400).json({
                error: 'Post cannot be empty'
            });
        }


        const post = await POST.create({

            author: req.session.userId,

            content: content.trim(),

            replyPermission:
                replyPermission || 'everyone'

        });


        console.log(
            "POST CREATED BY:",
            req.session.userId
        );


        return res.status(201).json({
            message: 'Post created successfully',
            post
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: error.message
        });

    }
}

module.exports = {
    createPost
};
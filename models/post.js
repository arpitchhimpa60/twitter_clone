const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 280
        },
        replyPermission: {
            type: String,
            enum: [
                'everyone',
                'accounts_you_follow',
                'mentioned_only'
            ],
            default: 'everyone'
        },
        media: [
            {
                type: String
            }
        ],
        gif: {
            type: String,
            default: null
        },
        poll: {
            question: {
                type: String,
                default: null
            },
            options: [
                {
                    type: String
                }
            ],
            duration: {
                type: Number,
                default: null
            }
        },
        location: {
            type: String,
            default: null
        },
        scheduledAt: {
            type: Date,
            default: null
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            }
        ],
        replies: {
            type: Number,
            default: 0
        },
        reposts: {
            type: Number,
            default: 0
        }
    },{timestamps: true});

const POST = mongoose.model('post', postSchema);

module.exports = POST;
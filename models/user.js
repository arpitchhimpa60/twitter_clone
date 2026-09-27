const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    visitedHistory: [
        {
            timpestamps: {
                type: Number
            }
        }
    ],

    // Users that this user follows
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],

    // Users who follow this user
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ]

}, {
    timestamps: true
});

const USER = mongoose.model('user', userSchema);

module.exports = USER;
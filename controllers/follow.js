const USER = require('../models/user');


// Get users that current user can follow
async function getUsersToFollow(req, res) {

    try {

        if (!req.session.userId) {
            return res.redirect('/login');
        }

        const currentUser = await USER.findById(
            req.session.userId
        );

        if (!currentUser) {
            return res.redirect('/login');
        }


        const users = await USER.find({
            _id: {
                $ne: currentUser._id
            }
        });


        const usersWithFollowStatus = users.map(otherUser => {

            const isFollowing =
                currentUser.following.some(
                    id => id.toString() === otherUser._id.toString()
                );


            return {
                ...otherUser.toObject(),
                isFollowing
            };

        });


        return res.render('follow', {
            user: currentUser,
            users: usersWithFollowStatus
        });


    } catch (error) {

        console.error(error);

        return res.status(500).send(
            'Something went wrong'
        );
    }
}


// Follow another user
async function followUser(req, res) {

    try {

        if (!req.session.userId) {
            return res.status(401).json({
                error: 'Login required'
            });
        }


        const currentUserId = req.session.userId;
        const targetUserId = req.params.userId;


        // Don't follow yourself
        if (
            currentUserId.toString() === targetUserId.toString()
        ) {

            return res.status(400).json({
                error: 'You cannot follow yourself'
            });

        }


        const currentUser = await USER.findById(
            currentUserId
        );

        const targetUser = await USER.findById(
            targetUserId
        );


        if (!currentUser || !targetUser) {

            return res.status(404).json({
                error: 'User not found'
            });

        }


        // Check current relationship
        const isFollowing =
            currentUser.following.some(
                id => id.toString() === targetUserId.toString()
            );


        // =================================
        // UNFOLLOW
        // =================================

        if (isFollowing) {

            await USER.findByIdAndUpdate(
                currentUserId,
                {
                    $pull: {
                        following: targetUserId
                    }
                }
            );


            await USER.findByIdAndUpdate(
                targetUserId,
                {
                    $pull: {
                        followers: currentUserId
                    }
                }
            );


            return res.json({
                message: 'User unfollowed successfully',
                following: false
            });

        }


        // =================================
        // FOLLOW
        // =================================

        await USER.findByIdAndUpdate(
            currentUserId,
            {
                $addToSet: {
                    following: targetUserId
                }
            }
        );


        await USER.findByIdAndUpdate(
            targetUserId,
            {
                $addToSet: {
                    followers: currentUserId
                }
            }
        );


        return res.json({
            message: 'User followed successfully',
            following: true
        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: error.message
        });

    }
}


module.exports = {
    getUsersToFollow,
    followUser
};
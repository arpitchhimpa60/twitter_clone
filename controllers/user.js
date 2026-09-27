const USER = require('../models/user')
async function getAllUsers(req,res){
    const result = await USER.find({});
    if (!result) {
        return res.status(404).json({
            error: "no user found"
        });
    }
    return res.status(200).json(result);
}

async function handleUserSignUp(req,res){
    try {
        const { username, email, password } = req.body;
        const user = await USER.create({
            username,
            email,
            password
        });
        console.log(user);
        return res.status(201).redirect('/');
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message
        });
    }
}

async function handleUserLgin(req, res) {
    const { email, password } = req.body;
    const result = await USER.findOne({
        email,
        password
    });
    if (!result) {
        return res.render('login', {
            error: "no user found"
        });
    }
    req.session.userId = result._id;
    return res.redirect('/');
}

module.exports = {getAllUsers,handleUserSignUp,handleUserLgin}
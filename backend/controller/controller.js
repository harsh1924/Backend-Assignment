const userModel = require('../model/userSchema.js')
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');

// SIGNUP
const signup = async (req, res, next) => {
    const { userName, userEmail, userPassword, nameOfUser, userBio } = req.body;
    console.log(userName, userEmail, userPassword, nameOfUser, userBio);

    //validations
    if (!userName || !userEmail || !userPassword || !nameOfUser || !userBio) {
        return res.status(400).json({
            success: false,
            messazge: "Please fill all the fields"
        });
    };
    const validEmail = emailValidator.validate(userEmail);
    if (!validEmail) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email"
        });
    };


    try {
        const userInfo = userModel(req.body);
        const result = await userInfo.save();
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (e) {
        if (e.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }
        return res.status(400).json({
            success: false,
            message: e.message
        });
    }
};


// SIGNIN LOGIC
const signin = async (req, res) => {
    const { userEmail, userPassword } = req.body;
    console.log(userEmail, userPassword);
    if (!userEmail || !userPassword) {
        return res.status(400).json({
            success: false,
            message: "Please fill all the fields"
        });
    };

    try {
        const user = await userModel.findOne({ userEmail }).select('+userPassword');
        if (!user || !await bcrypt.compare(userPassword, user.userPassword)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        };

        const token = user.jwtToken();
        user.userPassword = undefined;
        const cookieOption = {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true
        };
        res.cookie("token", token, cookieOption);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
};

// GETUSER
const getUser = async (req, res) => {
    try {
        const userId = req.user.id;
        userModel.findById(userId);
        return res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        return res.status(400),json({
            success: false,
            message: error.message
        });
    };
};

// LOGOUT
const logout = (req, res) => {
    try {
        const cookieOption = {
            expires: new Date(),
            httpOnly: true
        }
        res.cookie("token", null, cookieOption);
        return res.status(200).json({
            success: true,
            message: "Successfully logged out"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}


module.exports = {
    signup,
    signin,
    getUser,
    logout
}
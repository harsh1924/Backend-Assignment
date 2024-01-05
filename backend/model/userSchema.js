const mongoose = require('mongoose');
const { Schema } = mongoose;
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    userName: {
        type: String,
        required: [true, 'Username is required'],
        minLength: [5, 'atleast 5'],
        maxLength: [50, 'max 50'],
        trim: true
    },
    userEmail: {
        type: String,
        required: [true, 'Usermail is required'],
        unique: true,
        lowercase: true
    },
    userPassword: {
        type: String,
        required: true,
        select: false
    },
    nameOfUser: {
        type: String,
        required: true
    },
    userBio: {
        type: String,
        required: true
    },
    forgotPasswordToken: {
        type: String,
    },
    forgotPasswordExpires: {
        type: Date,
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('userPassword')) {
        return next();
    }
    if (this.isModified('userPassword')) {
        this.userPassword = await bcrypt.hash(this.userPassword, 10)
    }
});

userSchema.methods = {
    jwtToken() {
        return JWT.sign({
            id: this._id,
            email: this.email
        }, process.env.SECRET, { expiresIn: '24h' })
    }
}

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
const mongoose = require('mongoose') // mongoose is used for schema
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config();


const UserSchema = mongoose.Schema({
    name:{
        type: String,
        require: [true, 'Please provide a name'],
        minLength: 3,
        maxLength: 50
    },
    email:{
        type: String,
        require: [true, 'Please provide an email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, //regex
            'Please provide a valid email'
        ],
        unique: true
    },
    password:{
        type: String,
        require: [true, 'Please provide a password'],
        minLength: 6,
    }
})

// Hash Passsword
UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
}) 


// process.env.JWT_SECRET u still need to look into the all keys generator
// This function creates a JWT (JSON Web Token) for a user. Here's a breakdown:
// In simple terms — after a user signs up or logs in, you call user.createJWT() and send the token back to the client. 
// The client stores it and sends it with every request to prove they're logged in, instead of sending their 
// password every time.
UserSchema.methods.createJWT = function(){
    return jwt.sign({userId: this._id, name: this.name}, //PAYLOAD
         process.env.JWT_SECRET_KEY, // SECREST KEY
        {expiresIn: process.env.JWT_LIFE_TIME} // EXPIRES TOKEDN
)
}

// compare the passowrd
UserSchema.methods.comparePassword = async function (candidatePaassword){
    const isMatch = await bcrypt.compare(candidatePaassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)
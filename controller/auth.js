const { UnauthenticatedError, BadRequestError } = require('../errors')
const User = require('../models/User')
const {StatusCodes} = require('http-status-code')

const register = async () => {
    const user = await User.create({...req.body})
    console.log("892929", user)
    const token = user.createJWT() // createJWT() it creates token
    console.log("user:",user)
    console.log(token)
    res.status(StatusCodes.CREATED).json({user:{name: user.name}, token})
}

const login = async (req, res) => {
    const {email, password} = req.body;
    // if user do not fill  there field or it's not true
    if(!email || !password){
        throw new BadRequestError("Please provide an email")
    }
    // To verify the login or if the user exits
    const user = await User.findOne({email})
    // if user info is wrong || if user is not authorized
    if(!user){
        throw new UnauthenticatedError('Invalid Credentials')
    }
    // check if password is correct
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
         throw new UnauthenticatedError('Invalid Credentials')
    }
      // if user is verified
    const token = user.createJWT() // grabbing the token
    res.status(StatusCodes.OK).json({user:{name: user.name}, token})
    res.send('Login coming soon!')
}

module.export = 
{
    login,
    register
}
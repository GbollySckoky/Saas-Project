const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = async (req, res, next) => {
    // check header
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')){// if bearer is not passed to tghe header make the request fail
        throw new UnauthenticatedError('Authentication invalid')
    }
    
    const token = authHeader.split(' ')[1] //grab the token
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY) // verify token
        console.log(req.user)
         // attach the user to the job routes
    req.user = { userId: payload.userId, name: payload.name }
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
}

module.exports = auth
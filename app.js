require('dotenv').config();
const express = require('express')
const app = express()
// router files
const authRouter = require('./routes/auth')
const connectDB = require('./db/connect')
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authenticateUser = require('./middleware/authentication');


app.use(express.json())

app.use('/api/v1/auth', authRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000

const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI)
        console.log('MongoDB connected');
        app.listen(port, () => 
            console.log(`Server is listening on port ${port}...`)
        )
    }catch(error){
        console.log("ERROR!!!", error)
    }
}

start()
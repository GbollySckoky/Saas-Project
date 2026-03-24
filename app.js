require('dotenv').config();
const express = require('express')
const app = express()
// router files
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
const connectDB = require('./db/connect')
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authenticateUser = require('./middleware/authentication');
// extra security packages

/**
 * helmet
Sets secure HTTP response headers automatically. Protects against common attacks like clickjacking, sniffing, and cross-site scripting by telling the browser how to behave.
 */
const helmet = require('helmet');
/**
 * cors
Controls which domains can make requests to your API. Without it, browsers block cross-origin requests by default.
 */
const cors = require('cors');
/**
 * xss-clean
Sanitizes user input in req.body, req.query, and req.params — strips out any malicious HTML/JS before it touches your database.
 */
const xss = require('xss-clean');
/**
 * express-rate-limit
Limits how many requests a single IP can make in a time window. Prevents brute force attacks and API abuse.
 */
const rateLimiter = require('express-rate-limit');

app.set('trust proxy', 1);// trust first proxy
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json())
app.use(helmet());
app.use(cors());
app.use(xss());

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)


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
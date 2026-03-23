const Jobs = require("../models/Jobs")
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllJobs = async (req, res) => {
    console.log(req)
    // .sort('createdAt') orders them oldest first
    const jobs = await Jobs.find({createdBy: req.user.userId}).sort("createdAt") //req.user.userId comes from your auth middleware (JWT decoded and attached to req)
    res.status(StatusCodes.OK).json({jobs, count: jobs.length, message: 'Success'})
}

// userId — from auth middleware (req.user.userId)
// jobId — from the URL params (req.params.id), e.g. /jobs/abc123

const getJob = async (req, res) => {
    const {
        user: {userId},
        params: {id: jobId}
    } = req

    /***
     * Finds one specific job by its _id
     * But also checks createdBy: userId — this is important for authorization. It ensures a user can't fetch another user's job even if they know the ID
     * If nothing is found, throws a NotFoundError
     * The key security pattern here is that both functions always filter by createdBy: userId. The DB query itself enforces ownership — not just a manual check after fetching.
     */
    const job = await Job.findOne({
        _id: jobId,
        created: userId
    })

    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
}   

const createJob = async(req, res) => {
    /**
     * Before creating anything, it manually attaches the logged-in user's ID to the request body. 
     * This is how ownership gets stamped onto the job at creation time — the client never sends createdBy, 
     * the server sets it itself.
    */
   req.body.createdBy = req.user.userId
   const job = await Job.create(req.body)
   res.status(StatusCodes.CREATED).json({job, message: 'Job Created'})
}

const updateJob = async (req, res) => {
    const {
        body: {company, position},
        user: {userId}, // middleware id
        params: {id: jobId} // id params
    } = req

    if(!company === '' || !position == ""){
        throw new BadRequestError("Company or Position fields cannot be empty")
    }
    const job = await Job.findByIdAndUpdate({
        _id: jobId, // make query to the db to grab the id ||  _id is coming from mongodb
        createdBy: userId
    },
    req.body,
    {new: true, runValidators: true}
    )
    if(!job){
        throw new NotFoundError(`No job with ${jobId} found`)
    }
    res.status(StatusCodes.OK).json({job, message: 'Job Edited'})
}


const deleteJob = async (req, res) => {
    const {
        user: {userId},
        params: {id: jobId}
    } = req

    const job = await Job.findByIdAndRemove({
        _id: jobId,
        createdBy: userId
    })

    if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).send()
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}
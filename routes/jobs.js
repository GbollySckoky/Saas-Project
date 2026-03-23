const express = require('express')
const { getAllJobs, getJob, createJob } = require('../controller/jobs')
const router = express.Router()

router.route('/').get(getAllJobs).post(createJob)
router.route('/:id').get(getJob)
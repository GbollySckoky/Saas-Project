const { mongoose } = require("mongoose");

const JobsSchema = mongoose.Schema({
    comapny:{
        type: String,
        require: [true, 'Please provide a company name'],
        maxlength: 50
    },
    position:{
        type: String,
        require: [true, 'Please provide a position'],
        maxlength: 50
    },
    status:{
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending',
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user'],
    },
},
  { timestamps: true }
)

module.exports = mongoose.model('Job', JobsSchema)

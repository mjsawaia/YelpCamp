mongoose = require('mongoose')
Campground = require('./campground')
const { Schema } = mongoose

const reviewSchema = new Schema({
    rating: Number,
    body: String,
    author:
    {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Review', reviewSchema)
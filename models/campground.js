const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema
const { cloudinary } = require('../cloudinary')

const ImageSchema = new Schema({
    url: String,
    filename: String
})
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_300,h_225,c_fill')
})

const opts = { toJSON: { virtuals: true } }

const CampgroundSchema = new Schema({
    title: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author:
    {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]

}, opts)

CampgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground.reviews) {
        const res = await Review.deleteMany({ _id: { $in: campground.reviews } })
        console.log(res)
    }
    if (campground.images) {
        const seedPhoto = 'YelpCamp/woods_kdgweb'
        for (const img of campground.images) {
            if (img.filename !== seedPhoto) {
                const res = await cloudinary.uploader.destroy(img.filename)
                console.log(res)
            }
        }
    }
})

//virtual for mapbox popup on cluster map
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<a href="/campgrounds/${this._id}">${this.title}</a>
    <p>${this.description.substring(0, 50)}...</p>`

})

module.exports = mongoose.model('Campground', CampgroundSchema)
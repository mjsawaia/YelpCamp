const wrapAsync = require('../utils/wrapAsync')
const Review = require('../models/review')
const Campground = require('../models/campground')

module.exports.create = wrapAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id)
    const { body, rating } = req.body.review
    const review = new Review({ rating, body })
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Review posted successfully!')
    res.redirect(`/campgrounds/${campground._id}`)
})

module.exports.delete = wrapAsync(async (req, res, next) => {
    const { reviewId, id } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Review deleted successfully!')
    res.redirect(`/campgrounds/${id}`)
})
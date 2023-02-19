const express = require('express')
const router = express.Router({ mergeParams: true })
const reviews = require('../controllers/reviews')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')


router.post('/', isLoggedIn, validateReview, reviews.create)

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviews.delete)

module.exports = router
const express = require('express')
const router = express.Router()
const campgrounds = require('../controllers/campgrounds')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(campgrounds.index)
    .post(isLoggedIn, upload.array('image'), validateCampground, campgrounds.create)

router.get('/new', isLoggedIn, campgrounds.newForm)

router.route('/:id')
    .get(campgrounds.show)
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, campgrounds.update)
    .delete(isLoggedIn, isAuthor, campgrounds.delete)

router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.editForm)

module.exports = router
const wrapAsync = require('../utils/wrapAsync')
const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const { cloudinary } = require('../cloudinary')


module.exports.index = wrapAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({})
    if (!campgrounds) {
        throw new ExpressError('Campground Not Found', 404)
    }
    res.render('campgrounds/index', { campgrounds })
})

module.exports.newForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.editForm = wrapAsync(async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Campground not found. Please try again')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
})

module.exports.update = wrapAsync(async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground)
    const images = req.files.map((file) => {
        return {
            url: file.path,
            filename: file.filename
        }
    })
    campground.images.push(...images)
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    await campground.save()
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)
})

module.exports.create = wrapAsync(async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location
    }).send()
    const campground = new Campground(req.body.campground)
    campground.geometry = geoData.body.features[0].geometry
    campground.images = req.files.map((file) => {
        return {
            url: file.path,
            filename: file.filename
        }
    })
    campground.author = req.user._id
    await campground.save()
    console.log(campground)
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
})

module.exports.show = wrapAsync(async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
        .populate(
            {
                path: 'reviews',
                populate: {
                    path: 'author'
                }
            })
        .populate('author')
    if (!campground) {
        req.flash('error', 'Campground not found. Please try again')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground, })
})

module.exports.delete = wrapAsync(async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete(id)
    req.flash('success', 'Campground deleted successfully!')
    res.redirect('/campgrounds')
})
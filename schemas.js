const Joi = require('joi')
const sanitizeHtml = require('sanitize-html')


const custom = Joi.extend((joi) => {

    return {
        type: 'string',
        base: joi.string(),
        messages: {
            'string.escapeHTML': '{{#label}} must not contain HTML',
        },

        rules: {
            escapeHTML: {
                validate(value, helpers) {
                    const clean = sanitizeHtml(value, {
                        allowedTags: [],
                        allowedAttributes: {},
                    });
                    if (clean !== value) return helpers.error('string.escapeHTML', { value })
                    return clean
                }

            }
        }
    }
});



module.exports.campgroundSchema = custom.object({
    campground: custom.object({
        title: custom.string().required().escapeHTML(),
        price: custom.number().required().min(0),
        //image: custom.string().required(),
        location: custom.string().required().escapeHTML(),
        description: custom.string().required().escapeHTML()
    }).required(),
    deleteImages: custom.array()
})

module.exports.reviewSchema = custom.object({
    review: custom.object({
        rating: custom.number().required().min(1).max(5),
        body: custom.string().required().escapeHTML()
    }).required()
})
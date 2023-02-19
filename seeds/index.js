const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')
const connectDB = require('../db/connect')
require('dotenv').config()





connectDB(process.env.MONGO_URI)


const sample = array => array[Math.floor(Math.random() * array.length)]


const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 350; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Possimus aspernatur voluptas ea obcaecati fugiat. Nisi alias corrupti aspernatur, corporis vitae eius minus unde excepturi aut libero? Neque, perferendis? Architecto, assumenda! Cumque tempora eveniet unde perferendis corporis cupiditate voluptates fugiat accusamus officia, a amet animi soluta consectetur laudantium consequatur magnam beatae similique vitae eius error? Neque ducimus adipisci odit quasi natus! At officia animi adipisci qui cum sapiente ut totam in laborum. Autem modi doloremque aliquid amet debitis architecto, magni, quidem et aperiam placeat harum ut dolores excepturi voluptates odit enim!',
            price,
            author: '62017d88266455742bdb289f',
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dj3bokqkp/image/upload/v1645557335/YelpCamp/woods_kdgweb.jpg',
                    filename: 'YelpCamp/woods_kdgweb',
                }
            ]
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})


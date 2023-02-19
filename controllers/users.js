const wrapAsync = require('../utils/wrapAsync')
const User = require('../models/user')

module.exports.registerForm = (req, res) => {
    res.render('users/register')
}

module.exports.register = wrapAsync(async (req, res, next) => {
    const { username, password, email } = req.body
    const user = new User({ email, username })
    try {
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, (error) => {
            if (error) {
                return next(error)
            }
            req.flash('success', 'Welcome to Yelp Camp')
            res.redirect('/campgrounds')
        })
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/register')
    }
})

module.exports.loginForm = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logout()
    req.flash('success', 'Goodbye!')
    res.redirect('/campgrounds')
}
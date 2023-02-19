const express = require('express')
const router = express.Router({ mergeParams: true })
const users = require('../controllers/users')
const passport = require('passport')

router.route('/register')
    .get(users.registerForm)
    .post(users.register)

router.route('/login')
    .get(users.loginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)

module.exports = router
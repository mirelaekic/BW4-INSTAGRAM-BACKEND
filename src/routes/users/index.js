const User = require('../../database').User
const jwt = require('jsonwebtoken')

const router = require('express').Router()


router.route('/').post(async (req, res, next) => {
    try {
        const newUser = await User.create(req.body)
        res.send(newUser)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.route('/login').post(async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ where: { username } })
        if (user) {
            const isMatch = user.validPassword(password)
            if (isMatch) {
                const accessToken = await jwt.sign({ id: user.id }, process.env.JWT_KEY, { expiresIn: '15m' })
                const refreshToken = await jwt.sign({ id: user.id }, process.env.JWT_REFRESH_KEY, { expiresIn: '1w' })
                res.send({ accessToken, refreshToken })
            } else {
                res.status(401).send('unauthorized')
            }

        } else {
            res.status(401).send('unauthorized')
        }

    } catch (error) {
        console.log(error)
        next(error)
    }
})

module.exports = router
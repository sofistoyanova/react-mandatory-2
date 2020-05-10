const router = require('express').Router()
const User = require('../models/User')
const Address = require('../models/Address')
const ForgottenPassword = require('../models/ForgottenPassword')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendEmail = require('./modules/email')

router.post('/users/login', async (req, res) => {
    const { username, password } = req.body

    if(!username || !password) {
        return res.status(400).send({status: 400, message: 'Enter username and password'})
    }

    try {
        // Find user
        const users = await User.query().select().where({username: username}).limit(1)
        const user = users[0]
        if(!user) {
            return res.status(404).send({status: 404, message: 'User not found'})
        }
        
        // Compare passwords
        const doPasswordsMatch = await bcrypt.compare(password, user.password)
        if(!doPasswordsMatch) {
            return res.status(400).send({status: 400, message: 'Password did not match'})
        }

        req.session.userId = user.id
        req.session.save()
        console.log(req.session)
        res.send({status: 200, userId: user.id})
    } catch(err) {
        console.log(err)
        res.status(400).send()
    }
})

router.post('/users/register', async (req, res) => {
    //TODO: email verification
    const {username, email, password, confirmPassword, firstName, lastName} = req.body
    const emailPattern = /^\S+@\S+\.\S+$/
    const emailPatternMatch = email.match(emailPattern)

    if(!username || !email || !password || !confirmPassword || !firstName || !lastName) {
        return res.status(400).send({status: 400, message: 'Fillin all user details'})
    } else if(firstName.length < 2){
        return res.status(400).send({status: 400, message: 'First name should contain at lest 2 characters'})
    } else if(lastName.length < 2) {
        return res.status(400).send({status: 400, message: 'Last name should contain at lest 2 characters'})
    }else if(username.length < 4) {
        return res.status(400).send({status: 400, message: 'Username should contain at lest 4 characters'})
    } else if(password.length < 7) {
        return res.status(400).send({status: 400, message: 'Password should be at least 7 characters'})
    } else if (password !== confirmPassword) {
        return res.status(400).send({status: 400, message: 'Passwords did not match'})
    } else if(!emailPatternMatch) {
        return res.status(400).send({status: 400, message: 'Email is not in valid format'})
    } else {
        try {
            // Check if username exists
            const existingUsername = await User.query().select().where({ username })
            if(existingUsername[0]) {
                return res.status(400).send({status: 400, message: 'Username already exists'})
            } 

            // Check if email exists
            const existingEmail = await User.query().select().where({ email })
            if(existingEmail[0]) {
                return res.status(400).send({status: 400, message: 'Email already exists'})
            } 

            const hashedPassword = await bcrypt.hash(password, 3)
            const user = await User.query().insert({
                username: username,
                email: email,
                password: hashedPassword,
                first_name: firstName,
                last_name: lastName
            })

            req.session.userId = user.id
            req.session.save()
            res.send({status: 200, userId: user.id})
        } catch(err) {
            res.status(500).send({status: 500, message: 'Database error'})
        }
    }

})

router.get('/users/profile/:userId', async (req, res) => {
    console.log('sesion: ', req.session)
    const userId = req.params.userId
    const aUser = await User.query().select().where({id: userId})
    const user = aUser[0]
    const firstName = user.first_name
    res.send({ firstName })
})

router.post('/users/forgot-password', async (req, res) => {
    const { email } = req.body
    
    if(!email) {
        return res.status(400).send({status: 400, message: 'Please enter an email'})
    }

    try {
        const users = await User.query().select().where({email: email})
        user = users[0]

        if(!user){
            return res.status(400).send({status: 404, message: 'Email does not exists in the system'})
        }

        const userId = user.id
        const username = user.username
        const token = jwt.sign({ username }, 'forgottenpassword')
        const url = `localhost:9090/users/reset-password/${email}/${token}`

        // Delete any previous records matching the email
        const previousForgottenPasswordRecord = await ForgottenPassword.query().select().where({email: email})
        if(previousForgottenPasswordRecord[0]) {
            await ForgottenPassword.query().delete().where({email: email})
        }

        // Create new row
        await ForgottenPassword.query().insert({
            email: email,
            token: token
        })

        sendEmail(email, username, url)
        res.send('email was sent')
    } catch(err) {
        console.log(err)
        res.status(500).send()
    }
})

router.post('/users/reset-password/:email/:token', async (req, res) => {
    const { email, token } = req.params
    const { password, confirmPassword } = req.body

    // Password validation
    if(!password || !confirmPassword) {
        return res.status(400).send({message: 'fillin password and confirm the password'})
    } else if (password.length < 7) {
        return res.status(400).send({message: 'Password must be at least 7 characters'})
    } else if (password !== confirmPassword) {
        return res.status(400).send({message: 'Password did not match'})
    }

    try {
        // Find if record exists 
        const ifForgottenPasswords = await ForgottenPassword.query().select().where({ email, token })
        const forgottenPassword = ifForgottenPasswords[0]
        if(!forgottenPassword) {
            return res.status(404).send({message: 'Did not find any match'})
        }

        const hashedPassword = await bcrypt.hash(password, 3)

        // Update password
        await User.query().patch({ password: hashedPassword }).where({ email })
        res.send({message: 'password changed sucessfully'})
    } catch(err) {
        console.log(err)
        res.status(500).send()
    }
})

module.exports = router
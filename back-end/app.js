const express = require('express')
const app = express()
const userRoute = require('./routes/users')
const session = require('express-session')
const rateLimit = require("express-rate-limit");

//app.use(cors())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:9092")
    res.header("Access-Control-Allow-Origin", "http://localhost:3000")
    res.header("Access-Control-Allow-Credentials", true)
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
    next()
})
app.use(express.json())
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true
}))
app.use(userRoute)

/* Knex initialization */
const Knex = require('knex')
const knexFile = require('./knexfile.js')
const { Model } = require('objection')

const knex = Knex(knexFile.development)

// Give the knex instance to objection
Model.knex(knex)


const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use("/users/login", authLimiter);
app.use("/users/register", authLimiter);

/* Start the server  */
const port = process.env.PORT || 9092;

app.listen(port, (err) => {
    if(err) {
        return console.log('Error running Express')
    }
    console.log('Server is running on port: ', port)
})

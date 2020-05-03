const express = require('express')
const app = express()
const userRoute = require('./routes/users')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(userRoute)

/* Knex initialization */
const Knex = require('knex')
const knexFile = require('./knexfile.js')
const { Model } = require('objection')

const knex = Knex(knexFile.development)

// Give the knex instance to objection
Model.knex(knex)


/* Start the server  */
const port = process.env.PORT || 9090;

app.listen(port, (err) => {
    if(err) {
        return console.log('Error running Express')
    }
    console.log('Server is running on port: ', port)
})

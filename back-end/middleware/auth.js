const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
   try {
        // Find the token
        const token = req.header('Authorization').replace('Bearer ', '')

        // Verify the token
        const verifiedToken = jwt.verify(token, 'createjwttoken')
        console.log(verifiedToken)
        next()
   }catch(err) {
       res.status(401).send({message: 'Error with authentication'})
   }
}

module.exports = auth
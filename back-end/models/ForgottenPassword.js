const { Model } = require('objection')

class ForgottenPassword extends Model {
    static get tableName() {
        return 'forgot-password'
    }
}

module.exports = ForgottenPassword
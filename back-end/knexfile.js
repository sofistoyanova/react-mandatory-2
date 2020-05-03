const db_credentials = require('./config/db_config')
const knexSnakeCaseMapper = require('objection').knexSnakeCaseMappers;

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      database: db_credentials.database,
      user: db_credentials.user,
      password: db_credentials.password
    }
  },
  ...knexSnakeCaseMapper()
};

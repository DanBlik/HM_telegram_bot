const read = require('../db/read')

const getUsersList = async ({ database }) => await read({ db: database, collectionName: 'users' })

module.exports = getUsersList
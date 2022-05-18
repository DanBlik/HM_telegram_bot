const create = require('../db/create')

const userAdd = async ({ userName, group }) => {
  const operationStatus = await create({
    item: {
      username: userName,
      group,
    },
    uniqueFieldName: 'username',
    collectionName: 'users'
  })

  console.log('userAdd ', operationStatus)

  return operationStatus
}

module.exports = userAdd
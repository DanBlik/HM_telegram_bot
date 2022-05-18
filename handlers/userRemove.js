const removeFromDb = require('../db/remove')

const userRemove = async ({ userName }) => {
  const operationStatus = await removeFromDb({
    item: { userName },
    uniqueFieldName: 'username',
    collectionName: 'users'
  })

  console.log('userRemove ', operationStatus)
  return operationStatus
}

module.exports = userRemove
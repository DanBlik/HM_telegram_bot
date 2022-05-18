const removeFromDb = require('../db/remove')

const userRemove = async ({ username }) => {
  const operationStatus = await removeFromDb({
    item: { username },
    uniqueFieldName: 'username',
    collectionName: 'users'
  })

  console.log('userRemove ', operationStatus)
  return operationStatus
}

module.exports = userRemove
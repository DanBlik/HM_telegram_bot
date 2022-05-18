const removeFromDb = require('../db/remove')

const remove = async ({ name }) => {
  const operationStatus = await removeFromDb({
    item: { name },
    uniqueFieldName: 'name',
    collectionName: 'sprintNames'
  })

  console.log('userAdd ', operationStatus)
  return operationStatus
}

module.exports = remove
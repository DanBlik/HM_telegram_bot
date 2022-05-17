const removeFromDb = require('../db/remove')

const remove = async ({ name, database }) => {
  // const messageText = ctx.message.text
  // const [, name] = messageText.split(/\W/g).filter(word => word !== '')

  const operationStatus = await removeFromDb({
    db: database,
    item: { name },
    uniqueFieldName: 'name',
    collectionName: 'sprintNames'
  })

  console.log('userAdd ', operationStatus)
}

module.exports = remove
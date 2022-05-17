const removeFromDb = require('../db/remove')

const userRemove = async ({ userName, database }) => {
  // const messageText = ctx.message.text
  // const [, username] = messageText.split(/\W/g).filter(word => word !== '')

  const operationStatus = await removeFromDb({
    db: database,
    item: { userName },
    uniqueFieldName: 'username',
    collectionName: 'users'
  })

  console.log('userRemove ', operationStatus)
}

module.exports = userRemove
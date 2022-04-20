const removeFromDb = '../db/remove.js'

const remove = async ({ctx, database}) => {
  const messageText = ctx.message.text
  const [, name] = messageText.split(/\W/g).filter(word => word !== '')

  await removeFromDb ({
    db: database,
    item: { name },
    uniqueFieldName: 'name',
    collectionName: 'sprintNames'
  })
}

module.exports = remove
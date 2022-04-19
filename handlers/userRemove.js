const userRemove = async (ctx) => {
  const messageText = ctx.message.text
  const [, username] = messageText.split(/\W/g).filter(word => word !== '')

  await remove({
    db: database,
    item: { username },
    uniqueFieldName: 'username',
    collectionName: 'users'
  })
}

module.exports = userRemove
const create = require('../db/create')

const userAdd = async ({ ctx, database }) => {
  const messageText = ctx.message.text
  const [, username, group] = messageText.split(/\W/g).filter(word => word !== '')

  const operationStatus = await create({
    db: database,
    item: {
      username,
      group,
    },
    uniqueFieldName: 'username',
    collectionName: 'users'
  })
  ctx.reply(operationStatus === 'success' ? 'Пользователь добавлен.' : 'Такой пользователь уже есть в списке.')
}

module.exports = userAdd
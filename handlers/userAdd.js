const create = require('../db/create')

const userAdd = async ({ userName, group, database }) => {
  // const messageText = ctx.message.text
  // const [, userName, group] = messageText.split(/\W/g).filter(word => word !== '')

  const operationStatus = await create({
    db: database,
    item: {
      username: userName,
      group,
    },
    uniqueFieldName: 'username',
    collectionName: 'users'
  })

  console.log('userAdd ', operationStatus)
  // ctx.reply(operationStatus === 'success' ? 'Пользователь добавлен.' : 'Такой пользователь уже есть в списке.')
}

module.exports = userAdd
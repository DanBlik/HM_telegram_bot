const create = require('../db/create')

const add = async ({ ctx, database }) => {
  const messageText = ctx.message.text
  const [, name, description] = messageText.split(/\W/g).filter(word => word !== '')

  const operationStatus = await create({
    db: database,
    item: {
      name,
      description,
      author: ctx.message?.chat,
    },
    uniqueFieldName: 'name',
    collectionName: 'sprintNames'
  })
  ctx.reply(operationStatus === 'success' ? 'Название добавлено.' : 'Такое название уже есть в списке.')
}

module.exports = add
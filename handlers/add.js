const create = require('../db/create')

const add = async ({ name, description, author, database }) => {
  // const messageText = ctx.message.text
  // const [, name, description] = messageText.split(/\W/g).filter(word => word !== '')

  const operationStatus = await create({
    db: database,
    item: {
      name,
      description,
      author,
      // author: ctx.message?.chat,
    },
    uniqueFieldName: 'name',
    collectionName: 'sprintNames'
  })

  console.log('add ', operationStatus)
  // ctx.reply(operationStatus === 'success' ? 'Название добавлено.' : 'Такое название уже есть в списке.')
}

module.exports = add
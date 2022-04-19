const read = require('../db/read')

const userList = async ({ctx, database}) => {
  const sprintNamesList = await read({ db: database, collectionName: 'users' })

  if (sprintNamesList.length !== 0) {
    ctx.replyWithHTML(sprintNamesList.map(({ username, group }) => `<b>${username}|group: ${group}</b>`).join('\n'))
  }
}

module.exports = userList
const read = require('../db/read')

const list = async ({ ctx, database }) => {
  const sprintNamesList = await read({ db: database, collectionName: 'sprintNames' })
  console.log(ctx.message)

  if (sprintNamesList.length !== 0) {
    ctx.replyWithHTML(sprintNamesList.map(({ name }) => `<b>${name}</b>`).join('\n'))
  }
}

module.exports = list
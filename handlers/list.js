const read = require('../db/read')

const list = async ({ ctx, database }) => {
  const sprintNamesList = await read({ db: database, collectionName: 'sprintNames' })
  console.log(ctx.message)

  if (sprintNamesList.length !== 0) {
    ctx.replyWithHTML(`Список названий:\n\n${sprintNamesList.map(({ name }, idx) => `<b>${idx + 1}) ${name}</b>`).join('\n')}\n\nЧтобы предложить своё название введите команду /add`)
  }
}

module.exports = list
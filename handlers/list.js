const read = require('../db/read')

const list = async ({ ctx }) => {
  const sprintNamesList = await read({ collectionName: 'sprintNames' })

  if (sprintNamesList.length !== 0) {
    ctx.replyWithHTML(`Список названий:\n\n${sprintNamesList.map(({ name }) => `<b>${name}</b>`).join('\n')}`)
  } else {
    ctx.replyWithHTML('Список названий пуст.')
  }
}

module.exports = list
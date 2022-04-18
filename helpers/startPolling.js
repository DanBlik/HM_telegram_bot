const read = require('../db/read')

const startPolling = async ({ ctx, db }) => {
  const chatId = -792421822
  // const chatId = ctx.message.chat.id
  const pollName = 'Голосуем за название спринта:'
  const sprintNames = await read({ db, collectionName: 'sprintNames' })
  const options = sprintNames?.map(sprintName => sprintName.name)
  const pollObject = await ctx.telegram.sendPoll(chatId, pollName, options)
  
  setTimeout(() => {
    ctx.telegram.stopPoll(chatId, pollObject.message_id)
  }, 120000);
}

module.exports = startPolling
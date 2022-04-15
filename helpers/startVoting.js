const getNamesFromDB = require('./getNamesFromDB')

const startVoting = async ({ ctx, db }) => {
  const chatId = ctx.message.chat.id
  const pollName = 'Голосуем за название спринта.'
  const options = await getNamesFromDB({ db })
  await ctx.telegram.sendPoll(chatId, pollName, options)
}

module.exports = startVoting
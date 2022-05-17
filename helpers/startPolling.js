const read = require('../db/read')

const startPolling = async ({ ctx, db, timer }) => {
  // test chat
  // const chatId = -792421822
  // HM chat
  const chatId = -1001261652329
  // const chatId = ctx.message.chat.id
  const pollName = 'Голосуем за название спринта:'
  const sprintNames = await read({ db, collectionName: 'sprintNames' })
  const options = sprintNames?.map(sprintName => sprintName.name)
  const pollObject = await ctx.telegram.sendPoll(chatId, pollName, options)
  console.log(pollObject)
  if (!Number.isNaN(timer)) {
    setTimeout(() => {
      ctx.telegram.stopPoll(chatId, pollObject.message_id)
    }, (timer === 0 ? 5 : timer) * 60 * 1000);
  }
}

module.exports = startPolling
require('dotenv').config()
const read = require('../db/read')

const { NODE_ENV } = process.env

const getCurrentChatId = () => {
  if (NODE_ENV === 'production') {
    return -1001261652329
  }

  return -792421822
}

const startPolling = async ({ ctx, timer }) => {
  const chatId = getCurrentChatId()
  const pollName = 'Голосуем за название спринта:'
  const sprintNames = await read({ collectionName: 'sprintNames' })
  const options = sprintNames?.map(sprintName => sprintName.name)
  const pollObject = await ctx.telegram.sendPoll(chatId, pollName, options)

  if (!Number.isNaN(timer)) {
    setTimeout(() => {
      ctx.telegram.stopPoll(chatId, pollObject.message_id)
    }, (timer === 0 ? 5 : timer) * 60 * 1000);
  }
}

module.exports = startPolling
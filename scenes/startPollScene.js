const { Telegraf, Scenes: { WizardScene }, Markup } = require('telegraf')

const database = require('../firebase')
const startPolling = require('../helpers/startPolling')

const exit_keyboard = Markup.keyboard(['exit']).oneTime()

const timerHandler = Telegraf.on('text', async (ctx) => {
  const time = parseInt(ctx.message.text, 10)

  if (Object.is(time, NaN)) {
    ctx.reply('Неверный формат ввода!')

    return ctx.scene.leave()
  }

  try {
    await startPolling({ ctx, db: database, timer: time })
  } catch (error) {
    console.log(error)
  }

  return ctx.scene.leave()
})

const startPollScene = new WizardScene('startPollScene', timerHandler)
startPollScene.enter((ctx) => ctx.reply('Введите длительность голосования(в минутах), где 0 - без таймера:', exit_keyboard))

module.exports = startPollScene
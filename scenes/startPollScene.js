const { Telegraf, Scenes: { WizardScene }, Markup } = require('telegraf')

const startPolling = require('../helpers/startPolling')

const exit_keyboard = Markup.keyboard(['exit']).oneTime()

const timerHandler = Telegraf.on('text', async (ctx) => {
  const time = parseFloat(ctx.message.text)

  if (Object.is(time, NaN)) {
    ctx.reply('Неверный формат ввода!', Markup.removeKeyboard())

    return ctx.scene.leave()
  }

  try {
    const status = await startPolling({ ctx, timer: time })

    if (status === 'empty') {
      ctx.reply('Список для голосования пуст!', Markup.removeKeyboard())

      return ctx.scene.leave()
    }
    ctx.reply(`Голосование запущенно на ${time} минут!`, Markup.removeKeyboard())
    
  } catch (error) {
    console.log(error)
  }

  return ctx.scene.leave()
})

const startPollScene = new WizardScene('startPollScene', timerHandler)
startPollScene.enter((ctx) => ctx.reply('Введите длительность голосования(в минутах), где 0 - без таймера:', exit_keyboard))

module.exports = startPollScene
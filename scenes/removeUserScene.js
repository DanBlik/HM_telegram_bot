const { Telegraf, Scenes: { WizardScene }, Markup } = require('telegraf')

const database = require('../firebase')
const userRemove = require('../handlers/userRemove')

const exit_keyboard = Markup.keyboard(['exit']).oneTime()

const nameToRemoveHandler = Telegraf.on('text', async (ctx) => {
  try {
    await userRemove({
      name: ctx.message.text,
      database,
    })

    await ctx.reply(`${ctx.message.text} удален!`, Markup.removeKeyboard())
  } catch (error) {
    console.log(error)
  }

  return ctx.scene.leave()
})

const removeUserScene = new WizardScene('removeUserScene', nameToRemoveHandler)
removeUserScene.enter((ctx) => ctx.reply('Введите имя пользльзвателя:', exit_keyboard))

module.exports = removeUserScene
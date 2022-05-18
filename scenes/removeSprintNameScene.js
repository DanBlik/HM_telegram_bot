const { Telegraf, Scenes: { WizardScene }, Markup } = require('telegraf')

const database = require('../firebase')
const remove = require('../handlers/remove')

const exit_keyboard = Markup.keyboard(['exit']).oneTime()

const sprintNameHandler = Telegraf.on('text', async (ctx) => {
  try {
    await remove({
      name: ctx.message.text,
      database,
    })

    await ctx.reply(`${ctx.message.text} удален!`, Markup.removeKeyboard())
  } catch (error) {
    console.log(error)
  }

  return ctx.scene.leave()
})

const removeSprintNameScene = new WizardScene('removeSprintNameScene', sprintNameHandler)
removeSprintNameScene.enter((ctx) => ctx.reply('Введите название спринта для удаления:', exit_keyboard))

module.exports = removeSprintNameScene
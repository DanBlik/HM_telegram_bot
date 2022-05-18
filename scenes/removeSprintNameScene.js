const { Telegraf, Scenes: { WizardScene }, Markup } = require('telegraf')

const remove = require('../handlers/remove')

const exit_keyboard = Markup.keyboard(['exit']).oneTime()

const sprintNameHandler = Telegraf.on('text', async (ctx) => {
  try {
    const status = await remove({ name: ctx.message.text })

    if (status === 'succes') {
      await ctx.reply(`${ctx.message.text} удален!`, Markup.removeKeyboard())
    } else {
      await ctx.reply('Что-то пошло не так, возможно такое название не существует. Проверьте правильность ввода, либо повторите позже.', Markup.removeKeyboard())
    }
  } catch (error) {
    console.log(error)
  }

  return ctx.scene.leave()
})

const removeSprintNameScene = new WizardScene('removeSprintNameScene', sprintNameHandler)
removeSprintNameScene.enter((ctx) => ctx.reply('Введите название спринта для удаления:', exit_keyboard))

module.exports = removeSprintNameScene
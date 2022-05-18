const { Telegraf, Scenes: { WizardScene }, Markup } = require('telegraf')

const userRemove = require('../handlers/userRemove')

const exit_keyboard = Markup.keyboard(['exit']).oneTime()

const nameToRemoveHandler = Telegraf.on('text', async (ctx) => {
  try {
    const status = await userRemove({ name: ctx.message.text })

    if (status === 'succes') {
      await ctx.reply(`${ctx.message.text} удален!`, Markup.removeKeyboard())
    } else {
      await ctx.reply('Что-то пошло не так, возможно такой пользователь не существует. Проверьте правильность ввода, либо повторите позже.', Markup.removeKeyboard())
    }
  } catch (error) {
    console.log(error)
  }

  return ctx.scene.leave()
})

const removeUserScene = new WizardScene('removeUserScene', nameToRemoveHandler)
removeUserScene.enter((ctx) => ctx.reply('Введите имя пользльзвателя:', exit_keyboard))

module.exports = removeUserScene
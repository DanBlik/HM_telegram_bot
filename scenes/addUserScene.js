const { Telegraf, Scenes: { WizardScene }, Markup } = require('telegraf')

const database = require('../firebase')
const userAdd = require('../handlers/userAdd')

const exit_keyboard = Markup.keyboard(['exit']).oneTime()

const addNameHandler = Telegraf.on('text', async (ctx) => {
  ctx.scene.state.userName = ctx.message.text

  await ctx.reply('Введите название группы:', exit_keyboard)

  return ctx.wizard.next()
})

const groupHandler = Telegraf.on('text', async (ctx) => {
  console.log(ctx.scene.state.userName + ' ' + ctx.message.text)

  try {
    await userAdd({
      userName: ctx.scene.state.userName,
      group: ctx.message.text,
      database,
    })
    await ctx.reply('Пользователь сохранен!')
  } catch (error) {
    console.log(error)
  }

  return ctx.scene.leave()
})

const addUserScene = new WizardScene('addUserScene', addNameHandler, groupHandler)
addUserScene.enter((ctx) => ctx.reply('Введите имя пользльзвателя:', exit_keyboard))

module.exports = addUserScene
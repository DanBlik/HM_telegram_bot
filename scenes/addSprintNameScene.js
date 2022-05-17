const { Telegraf, Scenes: { WizardScene }, Markup } = require('telegraf')

const database = require('../firebase')
const add = require('../handlers/add')

const exit_keyboard = Markup.keyboard(['exit']).oneTime()

const sprintNameHandler = Telegraf.on('text', async (ctx) => {
  ctx.scene.state.sprintName = ctx.message.text

  await ctx.reply('Введите описание названия:', exit_keyboard)

  return ctx.wizard.next()
})

const descriptionHandler = Telegraf.on('text', async (ctx) => {
  console.log(ctx.scene.state.sprintName + ' ' + ctx.message.text)

  try {
    await add({
      name: ctx.scene.state.sprintName,
      description: ctx.message.text,
      author: ctx.message?.chat,
      database,
    })
    await ctx.reply('Сохранено!')
  } catch (error) {
    console.log(error)
  }

  return ctx.scene.leave()
})

const addSprintNameScene = new WizardScene('addSprintNameScene', sprintNameHandler, descriptionHandler)
addSprintNameScene.enter((ctx) => ctx.reply('Введите новое название спринта:', exit_keyboard))

module.exports = addSprintNameScene
const { Telegraf, Scenes: { WizardScene }, Markup } = require('telegraf')

const database = require('../firebase')
const getUsersList = require('../handlers/getUsersList')

const btn_keyboard = Markup.keyboard(['/addUser', '/removeUser', '/usersList', 'exit']).oneTime()

const commandsChooseHandler = Telegraf.on('text', async (ctx) => {
  switch (ctx.message.text) {
    case '/addUser':
      return await ctx.scene.enter('addUserScene')
    // case '/updateUser':
    //   return await ctx.scene.enter('updateUserScene')
    case '/removeUser':
      return await ctx.scene.enter('removeUserScene')
    case '/usersList':
      const users = await getUsersList({ database })

      if (users.length !== 0) {
        ctx.replyWithHTML(users.map(({ username, group }) => `<b>${username}|group: ${group}</b>`).join('\n'), Markup.removeKeyboard())
      } else {
        ctx.reply('Список пользователей пуст!', Markup.removeKeyboard())
      }
      return await ctx.scene.leave()

    default:
      ctx.reply(`Данная команда "${ctx.message.text}" отсутствует!`)
      return ctx.scene.leave()
  }
})

const userCommandsScene = new WizardScene('userCommandsScene', commandsChooseHandler)
userCommandsScene.enter((ctx) => ctx.reply('Выберите дальнейшую команду:', btn_keyboard))

module.exports = userCommandsScene
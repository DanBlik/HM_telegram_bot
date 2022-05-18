require('dotenv').config()

const { Telegraf, Scenes: { Stage }, session } = require('telegraf')
const addSprintNameScene = require('./scenes/addSprintNameScene')
const userCommandsScene = require('./scenes/userCommandsScene')
const addUserScene = require('./scenes/addUserScene')
const removeUserScene = require('./scenes/removeUserScene')
const removeSprintNameScene = require('./scenes/removeSprintNameScene')
const startPollScene = require('./scenes/startPollScene')

const read = require('./db/read')

const list = require('./handlers/list')

const getBotToken = require('./tokenBot/getBotToken')

const MESSAGES = require('./messages')

const { URL, NODE_ENV, BOT_TOKEN_PROD } = process.env
const PORT = process.env.PORT || 5000

const bot = new Telegraf(getBotToken(process.env))

// обработка события изменения сообщений
bot.on('edited_message', () => { })

// bot.on('poll', (ctx) => {
//   if (ctx.update.poll.is_closed === true) {
//     console.log(ctx.update)
//   }
// })

// работаем только с личными чатами
bot.use((ctx, next) => {
  if (ctx.message?.chat.type === 'private') {
    next()
  }
})

bot.start((ctx) => ctx.reply(MESSAGES.start))
bot.help((ctx) => ctx.replyWithHTML(MESSAGES.help.user))

const stage = new Stage([
  addSprintNameScene,
  userCommandsScene,
  addUserScene,
  removeUserScene,
  removeSprintNameScene,
  startPollScene,
])
stage.hears('exit', (ctx) => ctx.scene.leave())
bot.use(session(), stage.middleware())

bot.command('/list', async (ctx) => list({ ctx }))

bot.command('/add', async (ctx) => {
  try {
    await ctx.scene.enter('addSprintNameScene')
  } catch (e) {
    console.log('cant add', e)
  }
})

/*-------------admin block----------------*/

bot.use(async (ctx, next) => {
  const userList = await read({ collectionName: 'users' })
  const isCurrentUserAdmin = userList?.find(({ username, group }) => username === ctx.message.chat.username && group === 'admin')

  if (isCurrentUserAdmin) {
    next()
  }
})

bot.command('/poll', async (ctx) => {
  try {
    await ctx.scene.enter('startPollScene')
  } catch (e) {
    console.log('cant start poll', e)
  }
})


/*-------------admin block----------------*/

//super root admins
bot.use((ctx, next) => {
  if (['blikoff_d', 'defmaxov'].includes(ctx.message.chat.username)) {
    next()
  }
})

bot.command('/user', async (ctx) => {
  try {
    await ctx.scene.enter('userCommandsScene')
  } catch (e) {
    console.log('err in user command', e)
  }
})
bot.command('/remove', async (ctx) => {
  try {
    await ctx.scene.enter('removeSprintNameScene')
  } catch (e) {
    console.log('cant remove', e)
  }
})

if (NODE_ENV === 'production') {
  bot.launch({
    webhook: {
      domain: `${URL}/bot-${BOT_TOKEN_PROD}`,
      port: PORT
    }
  })

  console.log('Started with web hook')
} else {
  bot.launch()
    .then(() => console.log('Bot is running'))
    .catch(err => console.log(err))
}

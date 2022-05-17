require('dotenv').config()

const { Telegraf, Scenes: { Stage }, session } = require('telegraf')
const addSprintNameScene = require('./scenes/addSprintNameScene')
const userCommandsScene = require('./scenes/userCommandsScene')
const addUserScene = require('./scenes/addUserScene')
const removeUserScene = require('./scenes/removeUserScene')
const removeSprintNameScene = require('./scenes/removeSprintNameScene')

const read = require('./db/read')

const list = require('./handlers/list')
const poll = require('./handlers/poll')

const getBotToken = require('./tokenBot/getBotToken')

const MESSAGES = require('./messages')

const database = require('./firebase')

const { URL, NODE_ENV } = process.env
const PORT = process.env.PORT || 5000

const bot = new Telegraf(getBotToken(process.env))

// обработка события изменения сообщений
bot.on('edited_message', () => { })

// bot.on('poll', (ctx) => {

// })

// работаем только с личными чатами
bot.use((ctx, next) => {
  if (ctx.message?.chat.type === 'private') {
    next()
  }
})

bot.start((ctx) => ctx.reply(MESSAGES.start))
bot.help((ctx) => ctx.replyWithHTML(MESSAGES.help.user))

bot.command('list', async (ctx) => list({ ctx, database }))

bot.command('/add', async (ctx) => {
  try {
    await ctx.scene.enter('addSprintNameScene')
  } catch (e) {
    console.log('cant add', e)
  }
})

/*-------------admin block----------------*/

bot.use(async (ctx, next) => {
  const userList = await read({ db: database, collectionName: 'users' })
  const isCurrentUserAdmin = userList?.find(({ username, group }) => username === ctx.message.chat.username && group === 'admin')

  if (isCurrentUserAdmin) {
    next()
  }
})

bot.command('poll', async (ctx) => poll({ ctx, db: database }))

/*-------------admin block----------------*/

//super root admins
bot.use((ctx, next) => {
  if (['blikoff_d', 'defmaxov'].includes(ctx.message.chat.username)) {
    next()
  }
})

const stage = new Stage([
  addSprintNameScene,
  userCommandsScene,
  addUserScene,
  removeUserScene,
  removeSprintNameScene,
])
stage.hears('exit', (ctx) => ctx.scene.leave())

bot.use(session(), stage.middleware())

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
      domain: `${URL}/bot-${BOT_TOKEN}`,
      port: PORT
    }
  })

  console.log('Started with web hook')
} else {
  bot.launch()
    .then(() => console.log('Bot is running'))
    .catch(err => console.log(err))
}

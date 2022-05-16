require('dotenv').config()

const { initializeApp } = require('firebase/app');
const { getDatabase } = require("firebase/database");
const { Telegraf } = require('telegraf');

const read = require('./db/read')

const startPolling = require('./helpers/startPolling')

const getFirebaseConfig = require('./firebase/getFirebaseConfig')

const userAdd = require('./handlers/userAdd')
const userList = require('./handlers/userList')
const remove = require('./handlers/remove')
const userRemove = require('./handlers/userRemove')
const add = require('./handlers/add')
const list = require('./handlers/list')

const getBotToken = require('./tokenBot/getBotToken')

const MESSAGES = require('./messages')

const { URL, NODE_ENV, BOT_TOKEN_PROD } = process.env
const PORT = process.env.PORT || 5000

const app = initializeApp(getFirebaseConfig(process.env));
const database = getDatabase(app);

const bot = new Telegraf(getBotToken(process.env))

//обработать изменение сообщений
bot.use((ctx, next) => {
  if (!ctx.editedMessage && ctx.message?.chat.type === 'private') {
    next()
  }
})

bot.start((ctx) => ctx.reply(MESSAGES.start))
bot.help((ctx) => ctx.replyWithHTML(MESSAGES.help.user))

bot.command('list', async (ctx) => list({ctx, database}))

/*-------------admin block----------------*/

bot.use(async (ctx, next) => {
  const userList = await read({ db: database, collectionName: 'users' })
  const isCurrentUserAdmin = userList?.find(({ username, group }) => username === ctx.message.chat.username && group === 'admin')

  if (isCurrentUserAdmin) {
    next()
  }
})

bot.command('add', async (ctx) => add({ctx, database}))

bot.command('poll', async (ctx) => startPolling({ ctx, db: database }))

/*-------------admin block----------------*/

//super root admins
bot.use((ctx, next) => {
  if (['blikoff_d', 'defmaxov'].includes(ctx.message.chat.username)) {
    next()
  }
})

bot.command('userAdd', async (ctx) => userAdd({ctx, database}))

bot.command('userList', async (ctx) => userList({ctx, database}))

bot.command('userRemove', async (ctx) => userRemove({ctx, database}))

bot.command('remove', async (ctx) => remove({ctx, database}))

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

require('dotenv').config()

const { initializeApp } = require('firebase/app');
const { getDatabase } = require("firebase/database");
const { Telegraf } = require('telegraf');

const create = require('./db/create')
const read = require('./db/read')
const remove = require('./db/remove')

const startPolling = require('./helpers/startPolling')

const MESSAGES = require('./messages')

const { BOT_TOKEN, FIREBASE_API_KEY, URL } = process.env
const PORT = process.env.PORT || 5000

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "sprintnamesbot.firebaseapp.com",
  databaseURL: "https://sprintnamesbot-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sprintnamesbot",
  storageBucket: "sprintnamesbot.appspot.com",
  messagingSenderId: "920693507915",
  appId: "1:920693507915:web:2a5aa469840bd3324e0ace",
  measurementId: "G-NDGBEGHKHZ"
}

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const bot = new Telegraf(BOT_TOKEN)

//обработать изменение сообщений
bot.use((ctx, next) => {
  if (!ctx.editedMessage && ctx.message?.chat.type === 'private') {
    next()
  }
})

bot.start((ctx) => ctx.reply(MESSAGES.start))
bot.help((ctx) => {
  return ctx.replyWithHTML(MESSAGES.help.user)
})

bot.command(['show', 'list', 'showList'], async (ctx) => {
  const sprintNamesList = await read({ db: database, collectionName: 'sprintNames' })
  console.log(ctx.message)
  if (sprintNamesList.length !== 0) {
    ctx.replyWithHTML(sprintNamesList.map(({ name }) => `<b>${name}</b>`).join('\n'))
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

bot.command('add', async (ctx) => {
  const messageText = ctx.message.text
  const [, name, description] = messageText.split(/\W/g).filter(word => word !== '')

  const operationStatus = await create({
    db: database,
    item: {
      name,
      description,
      author: ctx.message?.chat,
    },
    uniqueFieldName: 'name',
    collectionName: 'sprintNames'
  })
  ctx.reply(operationStatus === 'success' ? 'Название добавлено.' : 'Такое название уже есть в списке.')
})

bot.command('poll', (ctx) => {
  startPolling({ ctx, db: database })
})

/*-------------admin block----------------*/

//super root admins
bot.use((ctx, next) => {
  if (['blikoff_d', 'defmaxov'].includes(ctx.message.chat.username)) {
    next()
  }
})

bot.command('userAdd', async (ctx) => {
  const messageText = ctx.message.text
  const [, username, group] = messageText.split(/\W/g).filter(word => word !== '')

  const operationStatus = await create({
    db: database,
    item: {
      username,
      group,
    },
    uniqueFieldName: 'username',
    collectionName: 'users'
  })
  ctx.reply(operationStatus === 'success' ? 'Пользователь добавлен.' : 'Такой пользователь уже есть в списке.')
})

bot.command(['userList'], async (ctx) => {
  const sprintNamesList = await read({ db: database, collectionName: 'users' })

  if (sprintNamesList.length !== 0) {
    ctx.replyWithHTML(sprintNamesList.map(({ username, group }) => `<b>${username}|group: ${group}</b>`).join('\n'))
  }
})

bot.command('userRemove', async (ctx) => {
  const messageText = ctx.message.text
  const [, username] = messageText.split(/\W/g).filter(word => word !== '')

  await remove({
    db: database,
    item: { username },
    uniqueFieldName: 'username',
    collectionName: 'users'
  })
})

bot.command('remove', async (ctx) => {
  const messageText = ctx.message.text
  const [, name] = messageText.split(/\W/g).filter(word => word !== '')

  await remove({
    db: database,
    item: { name },
    uniqueFieldName: 'name',
    collectionName: 'sprintNames'
  })
})

if (process.env.NODE_ENV === 'production') {
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

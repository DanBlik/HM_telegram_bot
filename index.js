// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app');
const { getDatabase } = require("firebase/database");

const { BOT_TOKEN, firebaseConfig } = require('./config')
const addSprintName = require('./addSprintName')
const showListNames = require('./showListNames')

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN || BOT_TOKEN)

bot.start((ctx) => ctx.reply('Привет! Это командный бот, для подробностей вызови команду /help'))
bot.help((ctx) => {
  return ctx.replyWithHTML(`
Бот для сбора названий спринта и голосования.

Список команд:
<b>/add some name</b> - Добавит <i>'some name'</i> в список названий
<b>/show</b> - Покажет существующий список с потенциальными названиями
<b>/startVoting</b> - Запускает голосование за название спринта (*Команда доступна только для админов)
  `)
})

bot.command('add', (ctx) => {
  const messageText = ctx.message.text
  const potentialName = messageText.split('/add ').join('')
  addSprintName({ db: database, name: potentialName, ctx })
})

bot.command(['show', 'list', 'showList'], (ctx) => {
  showListNames({ ctx, db: database })
})

bot.hears('hi', (ctx) => ctx.reply('Hey there'))

bot.launch()
  .then(() => console.log('Bot is running'))
  .catch(err => console.log(err))
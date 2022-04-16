require('dotenv').config()

// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app');
const { getDatabase } = require("firebase/database");

const addSprintName = require('./helpers/addSprintName')
const showListNames = require('./helpers/showListNames')
const startVoting = require('./helpers/startVoting')

const { BOT_TOKEN,  FIREBASE_API_KEY } = process.env

console.log(FIREBASE_API_KEY)
console.log(BOT_TOKEN)

// Initialize Firebase
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

const { Telegraf } = require('telegraf')

const bot = new Telegraf(BOT_TOKEN)

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

bot.command('startVoting', (ctx) => {
  startVoting({ ctx, db: database })
})

bot.hears('hi', (ctx) => ctx.reply('Hey there'))

bot.launch()
  .then(() => console.log('Bot is running'))
  .catch(err => console.log(err))
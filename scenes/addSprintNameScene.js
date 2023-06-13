const {
  Telegraf,
  Scenes: { WizardScene },
  Markup,
} = require("telegraf");

const read = require("../db/read");

const database = require("../firebase");
const add = require("../handlers/add");

const formatInput = require('../helpers/formatInput')

const exit_keyboard = Markup.keyboard(["exit"]).oneTime();

// const sprintNameHandler = Telegraf.on("text", async (ctx) => {
//   ctx.scene.state.sprintName = formatInput(ctx.message.text);

//   await ctx.reply("Введите описание названия:", exit_keyboard);

//   return ctx.wizard.next();
// });

const descriptionHandler = Telegraf.on("text", async (ctx) => {
  console.log(ctx.scene.state.sprintName + " " + ctx.message.text);

  try {
    await add({
      name: ctx.message.text,
      author: ctx.message?.chat,
      database,
    });
    await ctx.reply("Сохранено!", Markup.removeKeyboard());
  } catch (error) {
    console.log(error);
  }

  return ctx.scene.leave();
});

const addSprintNameScene = new WizardScene(
  "addSprintNameScene",
  descriptionHandler
);
addSprintNameScene.enter(async (ctx) => {

  // if (ctx.message?.chat.id == '53141560' || ctx.message?.chat.id == '121619185') {
  //   return ctx.scene.leave();
  // }

  try {
    const sprintNamesList = await read({
      db: database,
      collectionName: "sprintNames",
    });
    if (sprintNamesList.length > 9) {
      ctx.reply("Извините, в базе уже есть 10 названий");
      return ctx.scene.leave();
    }
  } catch (error) {
    ctx.reply(
      "Извините, произошла ошибка при получении списка названий, попробуйте позже."
    );
    console.log(error);
    return ctx.scene.leave();
  }

  ctx.reply("Введите новое название спринта:", exit_keyboard);
});

module.exports = addSprintNameScene;

const { ref, child, get } = require("firebase/database");

const showListNames = ({ ctx, db }) => {
  const dbRef = ref(db)
  get(child(dbRef, 'sprintNames'))
  .then((snapshot) => {
    if (snapshot.exists()) {
      const sprintNamesObj = snapshot.val()
      let resultString = ''

      Object.keys(sprintNamesObj)
      .map(key => resultString+= `\n<b>${sprintNamesObj[key].name}</b>`)

      ctx.replyWithHTML(resultString)
    } else ctx.reply('Список пуст. Будь первым, предложи свое название!')
  }).catch((error) => {
    console.error(error);
  });
}

module.exports = showListNames
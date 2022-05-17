const MESSAGES = {
  help: {
    user: `
Бот для голосования.

Список доступных команд:
<b>/add</b> - Предложить новое название спринта
<b>/list</b> - Покажет существующий список с потенциальными названиями`,
  admin: `
Бот для сбора названий спринта и голосования.

Список доступных команд:
<b>/add</b> - Предложить новое название спринта
<b>/list</b> - Покажет существующий список с потенциальными названиями
<b>/poll</b> - Запускает голосование за название спринта (*Команда доступна только для админов)`,
  },
  start: 'Привет! Это командный бот, для подробностей вызови команду /help',
}

module.exports = MESSAGES
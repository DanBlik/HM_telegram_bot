const startPolling = require('../helpers/startPolling')

const poll = ({ ctx, db }) => {
  const messageText = ctx.message.text
  const [, timer] = messageText.split(/\W/g).filter(word => word !== '')

  startPolling({ ctx, db, timer: parseInt(timer, 10) })
}

module.exports = poll
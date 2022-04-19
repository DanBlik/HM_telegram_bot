const getBotToken = (env) => {
  const { BOT_TOKEN_PROD, BOT_TOKEN_DEV, NODE_ENV } = env

  if (NODE_ENV === 'production') {
    return BOT_TOKEN_PROD
  }

  return BOT_TOKEN_DEV
}

module.exports = getBotToken
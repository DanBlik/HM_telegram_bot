const getFirebaseConfig = (env) => {
  const { NODE_ENV, FIREBASE_API_KEY_PROD, FIREBASE_API_KEY_DEV } = env

  if (NODE_ENV === 'production') {
    return {
      apiKey: FIREBASE_API_KEY_PROD,
      authDomain: "heavy-metrics-telegram-bot.firebaseapp.com",
      databaseURL: "https://heavy-metrics-telegram-bot-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "heavy-metrics-telegram-bot",
      storageBucket: "heavy-metrics-telegram-bot.appspot.com",
      messagingSenderId: "474603322345",
      appId: "1:474603322345:web:ccecf55486e949dd63e978"
    }
  }

  // firebase config dev
  return {
    apiKey: FIREBASE_API_KEY_DEV,
    authDomain: "sprintnamesbot.firebaseapp.com",
    databaseURL: "https://sprintnamesbot-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sprintnamesbot",
    storageBucket: "sprintnamesbot.appspot.com",
    messagingSenderId: "920693507915",
    appId: "1:920693507915:web:2a5aa469840bd3324e0ace",
    measurementId: "G-NDGBEGHKHZ"
  }
}


module.exports = getFirebaseConfig

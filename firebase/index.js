const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');
const getFirebaseConfig = require('./getFirebaseConfig');

const app = initializeApp(getFirebaseConfig(process.env));
const database = getDatabase(app);

module.exports = database
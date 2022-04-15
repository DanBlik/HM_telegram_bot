const { ref, child, get } = require("firebase/database");

// юзается только в startVoting. Стоит везде выпилить обращение к этому списку и юзать эту утилу
const getNamesFromDB = ({ db }) => {
  const dbRef = ref(db)
  return get(child(dbRef, 'sprintNames'))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const list = snapshot.val()
        return Object.keys(list).map(key => list[key].name)
      } else return []
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = getNamesFromDB
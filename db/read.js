const { ref, child, get } = require("firebase/database");

const read = async ({ db, collectionName }) => {
  const dbRef = ref(db)
  return await get(child(dbRef, collectionName))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const list = snapshot.val()
        return Object.keys(list).map(key => list[key])
      } else return []
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = read
const { ref, child, get, remove } = require("firebase/database");

const removeItem = async ({ db, collectionName, item, uniqueFieldName }) => {
  const dbRef = ref(db)

  const itemKey = await get(child(dbRef, collectionName))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const collection = snapshot.val()

        const [itemKey] = Object.entries(collection)
          .find(([, collectionItem]) => collectionItem?.[uniqueFieldName] === item[uniqueFieldName])

        if (itemKey) {
          return itemKey
        }

        return undefined
      }

      return undefined
    }).catch((error) => {
      console.error(error);
    });

  if (itemKey) {
    const currentItemRef = ref(db, `${collectionName}/${itemKey}`)
    remove(currentItemRef)
      .then(() => {
        console.log('Data delete successfully!')
      })
      .catch((error) => {
        console.log('The delete failed...')
      });
  }
}

module.exports = removeItem
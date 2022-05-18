const { ref, child, get, update } = require('firebase/database')
const database = require('../firebase')

const updateInDb = async ({ item, uniqueFieldName, updateItem, collectionName }) => {
  const dbRef = ref(database)

  const itemKey = await get(child(dbRef, collectionName))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const collection = snapshot.val()

        const currentItem = Object.keys(collection).map(key => collection[key]).find(collectionItem => collectionItem?.[uniqueFieldName] === item[uniqueFieldName])

        if (currentItem) {
          return currentItem.key
        }

        return undefined
      }

      return undefined
    }).catch((error) => {
      console.error(error);
    });

  if (itemKey) {
    const currentItemRef = ref(database, `${collectionName}/${itemKey}`)

    update(currentItemRef, updateItem)
      .then(() => {
        // Data saved successfully!
        console.log('Data update successfully!')
      })
      .catch((error) => {
        // The write failed...
        console.log('The update failed...')
      });
  }
}

module.exports = updateInDb
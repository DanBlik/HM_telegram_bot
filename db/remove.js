const { ref, child, get, remove } = require('firebase/database')
const database = require('../firebase')

const removeItem = async ({ collectionName, item, uniqueFieldName }) => {
  const dbRef = ref(database)

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
    const currentItemRef = ref(database, `${collectionName}/${itemKey}`)
    const status = await remove(currentItemRef)
      .then(() => {
        console.log('Data delete successfully!')
        return 'success'
      })
      .catch((error) => {
        console.log('The delete failed...')
        return 'failed'
      });

    return status
  }

  return 'failed'
}

module.exports = removeItem
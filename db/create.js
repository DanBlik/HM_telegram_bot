const { ref, set, child, get, push } = require('firebase/database')
const database = require('../firebase')

const create = async ({ item, uniqueFieldName, collectionName }) => {
  const dbRef = ref(database)

  const isUniq = await get(child(dbRef, collectionName))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const collection = snapshot.val()

        return !Object.keys(collection)
          .map(key => collection[key][uniqueFieldName])
          .includes(item[uniqueFieldName])
      }

      return false
    }).catch((error) => {
      console.error(error);
    });

  if (isUniq) {
    const postListRef = ref(database, collectionName);
    const newPostRef = push(postListRef);
    console.log({newPostRef, postListRef});
    set(newPostRef, item)
      .then(() => {
        console.log('Data saved successfully!')
      })
      .catch((error) => {
        console.log('The write failed...')
      });
    return 'success'
  }

  return 'fail'
}

module.exports = create
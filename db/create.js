const { ref, set, child, get, push } = require("firebase/database");

const create = async ({ db, item, uniqueFieldName, collectionName }) => {
  const dbRef = ref(db)

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
    const postListRef = ref(db, collectionName);
    const newPostRef = push(postListRef);
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
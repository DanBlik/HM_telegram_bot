const { ref, set, child, get, push } = require("firebase/database");

const addSprintName = ({ db, name, ctx }) => {
  let isUniq

  const dbRef = ref(db)
  get(child(dbRef, 'sprintNames'))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const sprintNamesObj = snapshot.val()
        isUniq = !Object.keys(sprintNamesObj)
          .map(key => sprintNamesObj[key].name)
          .includes(name)

        if (isUniq) {
          console.log("New uniq itemName.");
          pushChild({ name, db })
          ctx.reply('Название добавлено.')
        } else {
          ctx.reply('Такое название уже есть в списке.')
        }


      } else {
        console.log("Push first item.");
        pushChild({ name, db })
      }
    }).catch((error) => {
      console.error(error);
    });
}

const pushChild = ({ name, db }) => {
  const postListRef = ref(db, 'sprintNames');
  const newPostRef = push(postListRef);
  set(newPostRef, {
    name,
  })
    .then(() => {
      // Data saved successfully!
      console.log('Data saved successfully!')
    })
    .catch((error) => {
      // The write failed...
      console.log('The write failed...')
    });
}

module.exports = addSprintName
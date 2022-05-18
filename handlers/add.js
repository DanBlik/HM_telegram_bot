const create = require('../db/create')

const add = async ({ name, description, author }) => {
  const operationStatus = await create({
    item: {
      name,
      description,
      author,
    },
    uniqueFieldName: 'name',
    collectionName: 'sprintNames'
  })

  console.log('add ', operationStatus)
}

module.exports = add
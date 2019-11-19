async function installDatabase(databaseObject){

    await createUserTable(databaseObject);
    await createOptionTable(databaseObject);
    
}

async function createUserTable (databaseObject) {
    const promise = new Promise((resolve, reject) => {
        databaseObject.run('CREATE TABLE users(username text, password text, admin integer)', function (error) {
        if (error) {
          reject(console.log('Failed to add user'))
        } else {
          resolve(console.log('user add'))
        }
      })
    }).catch((reason) => { console.log('Create user table failed ' + reason) })

    return promise
}

async function createOptionTable(databaseObject){

    const promise = new Promise((resolve, reject) => {
        databaseObject.run('CREATE TABLE options(hour integer, min integer)', function (error) {
        if (error) {
          reject(console.log('Failed to add Options Table'))
        } else {
          resolve(console.log('option Table add'))
        }
      })
    }).catch((reason) => { console.log('Create Options table failed ' + reason) })

    return promise

  }

  module.exports = {installDatabase, createUserTable, createOptionTable}
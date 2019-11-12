var sqlite3 = require('sqlite3').verbose()

class Database {
  async connectTable () {
    const curentDatabaseObject = this

    let db

    const promise = new Promise((resolve, reject) => {
      db = new sqlite3.Database('./database/imagefetcher.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
          console.error(+err.message)
        } else {
          console.log('Connected to the image fetcher database.')
        }

        resolve(console.log('Connected'))
      })
    }).then(() => {
      curentDatabaseObject.db = db
      curentDatabaseObject.isDatabaseEmpty()
    }).catch((error) => { console.log('Error Connect Table ') + error })

    return promise
  }

  async createUserTable () {
    const curentDatabaseObject = this
    const promise = new Promise((resolve, reject) => {
      curentDatabaseObject.db.run('CREATE TABLE users(username text, password text, admin integer)', function (error) {
        if (error) {
          reject(console.log('Failed to add user'))
        } else {
          resolve(console.log('user add'))
        }
      })
    }).catch((reason) => { console.log('Create user table failed ' + reason) })

    return promise
  }

  async isDatabaseEmpty () {
    const datbaseObject = this
    const promise = new Promise((resolve, reject) => {
      datbaseObject.db.all('SELECT name FROM sqlite_master;', (err, row) => {
        console.log(row)
        resolve(row.length == 0)
      })
    }).then((isEmpty) => {
      if (isEmpty) {
        datbaseObject.createUserTable()
      }
    }).catch((reason) => {
      console.log(reason)
    })

    return promise
  }

  getDatabase () {
    return this.db
  }
}

module.exports = Database

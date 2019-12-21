const sqlite3 = require('sqlite3').verbose()
const InstallDatabase = require('./Install_Database')

class Database {
  async connectTable () {
    const curentDatabaseObject = this

    let db

    const promise = new Promise((resolve, reject) => {
      db = new sqlite3.Database('./data/database/imagefetcher.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
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
    }).catch((error) => { console.log('Error Connect Table ' + error) })

    return promise
  }

  async isDatabaseEmpty () {
    const datbaseObject = this
    const promise = new Promise((resolve, reject) => {
      datbaseObject.db.all('SELECT name FROM sqlite_master;', (err, row) => {
        console.log(row)
        resolve(row.length === 0)
      })
    }).then((isEmpty) => {
      if (isEmpty) {
        InstallDatabase.createUserTable(datbaseObject.db)
        InstallDatabase.createOptionTable(datbaseObject.db)
      }
    }).catch((reason) => {
      console.log(reason)
    })

    return promise
  }

  static async getDatabase () {
    const database = new Database()
    await database.connectTable()
    return database.db
  }
}

module.exports = Database

var sqlite3 = require('sqlite3').verbose();

class Database{

    constructor(){
    }

    connectTable(){

        let curentDatabaseObject=this;

        let promise = new Promise((resolve, reject)=>{

            let db = new sqlite3.Database('./database/imagefetcher.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
                if (err) {
                    console.error(+err.message);
                }else{
                    console.log('Connected to the image fetcher database.');
                }
    
              });
    
            curentDatabaseObject.db=db;

            resolve(console.log('Connected'));
            
        });

        return promise;
       

    }

    createUserTable(){
        this.db.run('CREATE TABLE users(username text, password text)');
    }

    isDatabaseEmpty(){
        let datbaseObject=this;
        let promise= new Promise( (resolve, reject)=>{

            datbaseObject.db.all('SELECT name FROM sqlite_master;', (err, row)=>{
                console.log(row);
                resolve(row.length == 0 ? true : false);
            });

        }). then((isEmpty)=>{
            if(isEmpty){
                this.createUserTable();
            }
        }).catch((reason)=>{
            console.log(reason);
        });

        return promise;

    }


}

module.exports = Database
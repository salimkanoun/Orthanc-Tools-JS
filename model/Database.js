var sqlite3 = require('sqlite3').verbose();

class Database{

    constructor(){
    }

    async connectTable(){

        let curentDatabaseObject=this;

        let db;

        let promise = new Promise((resolve, reject)=>{

            db = new sqlite3.Database('./database/imagefetcher.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
                if (err) {
                    console.error(+err.message);
                }else{
                    console.log('Connected to the image fetcher database.');
                }
                
                resolve(console.log('Connected'));

              });

            
            
        }).then(()=>{
            curentDatabaseObject.db=db;
            curentDatabaseObject.isDatabaseEmpty();
        });

        
        return promise;
       

    }

    async createUserTable(){
        let curentDatabaseObject=this;
        let promise = new Promise((resolve, reject)=>{

            curentDatabaseObject.db.run('CREATE TABLE users(username text, password text)', function(error){
                if(error){
                    reject(console.log('Failed to add user'))
                }else{
                    resolve(console.log('user add'));
                }
            });

        }).catch((reason)=>{console.log('promise failed'+reason)});

        return promise;
        
    }

    async isDatabaseEmpty(){
        let datbaseObject=this;
        let promise= new Promise( (resolve, reject)=>{

            datbaseObject.db.all('SELECT name FROM sqlite_master;', (err, row)=>{
                console.log(row);
                resolve(row.length == 0 ? true : false);
            });

        }). then((isEmpty)=>{
            if(isEmpty){
                datbaseObject.createUserTable();
            }
        }).catch((reason)=>{
            console.log(reason);
        });

        return promise;

    }

    getDatabase(){
        return this.db;
    }


}

module.exports = Database
const bcrypt = require('bcrypt');

class Users{

    static saltRounds=10;

    constructor(databaseObject, username){
        this.database=databaseObject;
        this.username=username;
    }

    getDetails(){
        var getStmt = `SELECT password, admin FROM users WHERE username=(?)`;
        let currentUser=this;
        let promise = new Promise((resolve, reject)=>{
            currentUser.database.get(getStmt, [currentUser.username], function(err, row) {
                console.log(err);
                console.log(row);
                if(row!==undefined){
                    currentUser.password=row.password;
                    currentUser.admin=row.admin;
                }
                
                resolve(console.log(currentUser.password));
            });

        }).catch( (error)=>{
            console.log('User Retrieve failed '+error);
        });

        return promise;
        
    }

    async checkPassword(plainPassword){
        let check =await bcrypt.compare(plainPassword, this.password).catch(()=>{return false});
        return check;
    }

    static async createUser(databaseObject, username, password, isAdmin){

        let promise = bcrypt.hash(password, Users.saltRounds).then(function(hash) {
            console.log(hash);
            databaseObject.run(`INSERT INTO users(username, password, admin) VALUES(?, ?, ?)`, [username, hash, isAdmin], function(err) {
                if(err){
                    console.log(err);
                }else{
                    console.log('Done');
                }
            })
        }).catch(function(error){
            console.log('user create Failed '+ error);
        });

        return promise;
       
    }

}

module.exports = Users
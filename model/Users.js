const bcrypt = require('bcrypt');

class Users{

    static saltRounds=10;

    constructor(databaseObject, username){
        
        this.database=databaseObject;
        this.username=username;

    }

    getDetails(){
        var getStmt = `SELECT password FROM users WHERE username=(?)`;
        let currentUser=this;
        let promise = new Promise((resolve, reject)=>{
            currentUser.database.get(getStmt, [currentUser.username], function(err, row) {
                currentUser.password=row.password;
                console.log(currentUser.password);
                resolve(console.log(currentUser.password));
            });

        }).catch( ()=>{
            console.log('User Retrieve failed');
        });

        return promise;
        
    }

    async checkPassword(plainPassword){
        let check =await bcrypt.compare(plainPassword, this.password).catch(()=>{console.log('compare failed')});
        return check;
    }

    static createUser(databaseObject, username, password){

        let promise = bcrypt.hash(password, Users.saltRounds).then(function(hash) {
            console.log(hash);
            databaseObject.run(`INSERT INTO users(username, password) VALUES(?, ?)`, [username, hash], function(err) {
                if(err){
                    console.log(err);
                }else{
                    console.log('Done');
                }
            })
        }).catch(function(){
            console.log('user create Failed');
        });

        return promise;

       
    }

    

    

}

module.exports = Users
var Database =require('../model/Database');
var Users =require('../model/Users');

var getResults = async function(req, res){
    let body=req.body;
    var databaseObject=new Database();
    await databaseObject.connectTable();
    await databaseObject.isDatabaseEmpty();
    await Users.createUser(databaseObject.db, 'salim', 'salim');
    let user=new Users(databaseObject.db, 'salim');
    await user.getDetails();
    let passwordCheck=await user.checkPassword('salim');
    console.log(passwordCheck);

};

module.exports={getResults};
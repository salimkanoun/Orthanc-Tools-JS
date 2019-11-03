var Users =require('../model/Users');
var Database=require('../model/Database');



var getResults = async function(req, res){
    let body=req.body;
    console.log(body);
    if( "username" in body){
        console.log(body.username);
        console.log(body.password);
        let databaseObject=new Database();
        await databaseObject.connectTable();
        
        let userObject=new Users(databaseObject.getDatabase(), body.username);
        await Users.createUser(databaseObject.getDatabase(), 'salim', 'salim', 0);
        await userObject.getDetails();
        let checkPassword= await userObject.checkPassword(body.password);
        console.log(checkPassword);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(checkPassword));

    }else{
        res.render('authentication');
    }
   
    
    
};

module.exports={getResults};
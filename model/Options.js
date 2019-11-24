class Options {

    constructor(databaseObject){
        this.databaseObject=databaseObject
    }
    
    async getOptions(){
        let currentOptions=this
        let promise = new Promise((resolve, reject)=>{
            let getStmt = `SELECT * FROM options`
            currentOptions.databaseObject.get(getStmt,[], function(err, row) {
                console.log(err)
                console.log(row)
                console.log(row)
                if(row!==undefined){
                    currentOptions.hour=row.hour;
                    currentOptions.min=row.min;
                }
                
                resolve({hour: currentOptions.hour, min : currentOptions.min});
            });

        }).catch( (error)=>{
            console.log('User Retrieve failed '+error);
        });

        return promise;
    
    }
  
    setScheduleTime(hour, min){
        let currentOptions=this;
        let promise = new Promise((resolve, reject)=>{

            currentOptions.databaseObject.run(`UPDATE options SET hour=?, min=?`, [hour, min], function(err) {
                if(err){
                    console.log(err);
                }else{
                    console.log('Done');
                }
                resolve(console.log('done'));
            })

        }).catch(function(error){
            console.log('update options Failed '+ error);
        });

        return promise;
    }
}

module.exports = Options

const Retrieve_Item = require('./Retrieve_Item')

class Robot_Job {

    constructor(username, projectName=['N/A'] ){
        this.username = username
        this.projectName = projectName
        this.retrieveList = []
        
    }

    addRetrieveItem(level, patientName, patientID, studyDate, modality, studyDescription, accessionNb, aet){
        let retrieveItem=new Retrieve_Item(level, patientName, patientID, studyDate, modality, studyDescription, accessionNb, aet)
        this.retrieveList.push(retrieveItem)
    }

    getRetriveItem(index){
        return this.retrieveList[index]
    }

    getRetrieveListSize () {
        return this.retrieveList.length
    }

    getProjectName () {
        return this.projectName
    }

    getRetrievedOrthancId(){

        let retrivedOrthancId= this.retrieveList.map(function(retrieveItem){
            return retrieveItem.getRetrievedOrthancId()
        })

        return retrivedOrthancId
    }

    toJSON(){
        return {
            username : this.username,
            projectName: this.projectName,
            retrieveList : this.retrieveList

        }
    }


}

module.exports = Robot_Job
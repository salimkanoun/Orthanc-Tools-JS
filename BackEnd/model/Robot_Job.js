const Retrieve_Item = require('./Retrieve_Item')

class Robot_Job {

    constructor(username, projectName=['N/A'] ){
        this.username = username
        this.projectName = projectName
        this.retrieveList = []
        
    }

    addRetrieveItem(level, patientName, patientID, studyDate, modality, studyDescription, accessionNb){
        let retrieveItem=new Retrieve_Item(level, patientName, patientID, studyDate, modality, studyDescription, accessionNb)
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

        let retrivedOrthancId= retrieveList.map(function(retrieveItem){
            return retrieveItem.getRetrievedOrthancId()
        })

        return retrivedOrthancId
    }


}

module.exports = Robot_Job
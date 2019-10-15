class QueryAnswer{

    constructor(answerPath, answerNumber, level, originAET, patientName, patientID, accessionNumber, studyDescription, studyInstanceUID, studyDate){
        this.answerPath=answerPath;
        this.answerNumber=answerNumber;
        this.level=level;
        this.originAET=originAET;
        this.patientName=patientName;
        this.patientID=patientID;
        this.accessionNumber=accessionNumber;
        this.studyDescription=studyDescription;
        this.studyInstanceUID=studyInstanceUID;
        this.studyDate=studyDate;
    }

}

module.exports = QueryAnswer;
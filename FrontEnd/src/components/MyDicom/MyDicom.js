import React, { Component } from 'react'
import apis from '../../services/apis'
import { connect } from 'react-redux'
import SHA1 from 'crypto-js/sha1'
import TableMyDicomPatientsStudies from '../CommonComponents/RessourcesDisplay/ReactTable/TableMyDicomPatientsStudies'
import TableMyDicomSeriesFillFromParent from '../CommonComponents/RessourcesDisplay/ReactTable/TableMyDicomSeriesFillFromParent'

class MyDicom extends Component{
  state = {
    user:null,
    labels:[],
    username:this.props.username,
    studies:[],
    currentStudyID:null,
    currentLabel:null,
    selectedRows:[]
  }

  async componentDidMount(){
    try{
      await this.initializeState()
    }catch(err){}
  }

  getUser = async () => {
    let users = await apis.User.getUsers()
    for(var i = 0;i<users.length;i++){
      if(users[i].username===this.props.username){
        this.setState({
          user:users[i]
        })
        break
      }
    }
  }

  getUserLabels = async () => {
    if(this.state.user!==null){
      let label_tab = await apis.userlabel.getUserLabels(this.state.user.id)
      this.setState({
        labels:label_tab
      })
    }else{
      throw new Error('Undefined user')
    }
  }

  initializeState = async () => {
    //Fake data set for GUI test : create 2 labels, add them to admin, add them to fake studies

    /*await apis.label.createLabels('test1')
    await apis.label.createLabels('test2')*/
    await this.getUser()
/*
    await apis.userlabel.createUserLabel(this.state.user.id,'test1')
    await apis.userlabel.createUserLabel(this.state.user.id,'test2')
    await apis.studylabel.createStudyLabel('ABCDEFG','test1','patient_exp')
    await apis.studylabel.createStudyLabel('ZEFDG','test2','patient_test')
    await apis.studylabel.createStudyLabel('ZEFDG','test1','patient_test')*/
    await this.getUserLabels()

  }

  getStudiesByLabel = async (name) => {
    return await apis.studylabel.getStudiesLabel(name)
  }

  _getOrthancStudyID = (patientID,studyInstanceUID) => {
    let hash = SHA1(patientID + "|" + studyInstanceUID).toString()
    return `${hash.substring(0, 8)}-${hash.substring(8, 16)}-${hash.substring(16, 24)}-${hash.substring(24, 32)}-${hash.substring(32, 40)}`
  }

  handleClick = async (e) => {
    var label = e.target.name
    this.setState({currentLabel:label})
    //reset all buttons to blue (primary)
    //e.target.className='btn btn-success'
    var studies = await this.getStudiesByLabel(label)
    var studies_tab = []

    for(var i = 0;i<studies.length;i++){
      var study = studies[i]
      var orthancID = this._getOrthancStudyID(study.patient_id,study.study_instance_uid)
      //search for infos about this orthancID and save them with this.state.studies ?
      studies_tab.push(
      {
        StudyOrthancID:'testStudyOrthancID'+i,
        StudyInstanceUID:'testStudyInstanceUID'+i,
        PatientID:'testPatientID'+i,
        PatientName:'testPatientName'+i,
        StudyDate:'testStudyDate'+i,
        StudyDescription:'testStudyDescription'+i,
        AccessionNumber:'testAccessionNumber'+i,
      })
      //studies_tab.push(await apis.content.getStudiesDetails(orthancID)) 
    }

    this.setState({
      studies:studies_tab,
      currentStudyID:null
    })
  }

  onStudyRowClick = (row)=> {
        this.setState({ 
          currentStudyID: row.StudyOrthancID
        })
  }

  onStudyCheckboxClick = (checkedBox) =>{
    if(checkedBox!==this.state.selectedRows){
      this.setState({
        selectedRows:checkedBox
      })
    }
    console.log(this.state.selectedRows)
  }

  render = () => {
    return (
      <div>
        <div className='jumbotron' name='buttons'>
          <h1>Labels</h1> 
          {this.state.labels.map(label => (
            <button name={label.label_name} style={{margin: "5px",width:"30%"}} key={label.label_name} type='button' className='btn btn-primary' onClick={this.handleClick}> {label.label_name} </button>
          ))}
        </div>

        <div className='jumbotron' name='studies using react table'>
        <h3 style={{color:" rgb(100, 100, 100)"}}>{this.state.currentLabel}</h3>
          <TableMyDicomPatientsStudies 
            tableData={this.state.studies}
            onRowClick={this.onStudyRowClick}
            onCheckboxClick={this.onStudyCheckboxClick}
            style={{padding:"50%"}}
          />
          <TableMyDicomSeriesFillFromParent 
            studyID={this.state.currentStudyID}   />
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    username: state.OrthancTools.username
  }
}

export default connect(mapStateToProps)(MyDicom)
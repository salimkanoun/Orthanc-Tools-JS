import React, { Component } from 'react'
import apis from '../../services/apis'
import { connect } from 'react-redux'
import SHA1 from 'crypto-js/sha1'
import TableStudy from '../CommonComponents/RessourcesDisplay/TableStudy'
import TableMyDicomPatientsStudies from '../CommonComponents/RessourcesDisplay/ReactTable/TableMyDicomPatientsStudies'
import TableMyDicomSeries from '../CommonComponents/RessourcesDisplay/ReactTable/TableMyDicomSeries'

class MyDicom extends Component{
  state = {
    user:null,
    labels:null,
    username:this.props.username,
    studies:[]
  }

  constructor(props){
    super(props)
    this.initializeState()
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
    //reset all buttons to blue (primary)
    //e.target.className='btn btn-success'
    var studies = await this.getStudiesByLabel(label)
    var studies_tab = []

    for(var i = 0;i<studies.length;i++){
      let study = studies[i]
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
      studies:studies_tab
    })
    this.render()
  }



  render = () => {
    var labels  = []
    if(this.state.labels!=null || this.state.labels===[]){
      labels = this.state.labels
    }

    return (
      <div>
        <div className='jumbotron' name='buttons'>
          <h1>Labels</h1> 
          {labels.map(label => (
            <button name={label.label_name} key={label.label_name} type='button' className='btn btn-primary' onClick={this.handleClick}> {label.label_name} </button>
          ))}
        </div>

        <div className='jumbotron' name='studies using react table'>
          <TableMyDicomPatientsStudies tableData={this.state.studies} />
          <TableMyDicomSeries tableData=''/>
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
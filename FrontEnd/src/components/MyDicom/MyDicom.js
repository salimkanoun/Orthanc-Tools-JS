import React, { Component } from 'react'
import apis from '../../services/apis'
import { connect } from 'react-redux'
import SHA1 from 'crypto-js/sha1'
import TableMyDicomPatientsStudies from '../CommonComponents/RessourcesDisplay/ReactTable/TableMyDicomPatientsStudies'
import TableMyDicomSeriesFillFromParent from '../CommonComponents/RessourcesDisplay/ReactTable/TableMyDicomSeriesFillFromParent'
import SendTo from '../CommonComponents/RessourcesDisplay/SendToAnonExportDeleteDropdown'

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
      await this.getUser()
      await this.getUserLabels()  
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

  getStudiesByLabel = async (name) => {
    return await apis.studylabel.getStudiesLabel(name)
  }

  _getOrthancStudyID = (patientID,studyInstanceUID) => {
    let hash = SHA1(patientID + "|" + studyInstanceUID).toString()
    return `${hash.substring(0, 8)}-${hash.substring(8, 16)}-${hash.substring(16, 24)}-${hash.substring(24, 32)}-${hash.substring(32, 40)}`
  }

  handleLabelClick = async (e) => {
    var label = e.target.name
    this.setState({currentLabel:label})
    var studies = await this.getStudiesByLabel(label)
    var studies_tab = []

    for(var i = 0;i<studies.length;i++){
      var study = studies[i]
      var orthancID = this._getOrthancStudyID(study.patient_id,study.study_instance_uid)
      let study_details = await apis.content.getStudiesDetails(orthancID)
      let row = {
        StudyOrthancID:study_details.ID,
        StudyInstanceUID:study_details.MainDicomTags.StudyInstanceUID,
        PatientID:study_details.PatientMainDicomTags.PatientID,
        PatientName:study_details.PatientMainDicomTags.PatientName,
        StudyDate:study_details.MainDicomTags.StudyDate,
        StudyDescription:study_details.MainDicomTags.StudyDescription,
        AccessionNumber:study_details.MainDicomTags.AccessionNumber
      }
      studies_tab.push(row)
    }

    this.setState({
      studies:studies_tab,
      currentStudyID:null,
      selectedRows:[]
    })
  }

  onStudyRowClick = (row)=> {
    this.setState({ 
      currentStudyID: row.StudyOrthancID
    })

}
  onStudyCheckboxClick = (tab) =>{
    var selectedRows = []
    for(var i = 0; i<tab.length;i++){
      selectedRows.push(tab[i].values.StudyOrthancID)
    }
    this.setState({selectedRows:selectedRows})
  }

  rowStyleStudies = (row) => {
    var style = ''
    if (row.StudyOrthancID === this.state.currentStudyID) {
        style = 'rgba(255,153,51)'
    }

    return style;
}



  render = () => {
    return (

        <div className='jumbotron'>
        <h1>Labels</h1> 
          {this.state.labels.map(label => (
            <button name={label.label_name} style={{margin: "5px",width:"30%"}} key={label.label_name} type='button' className={label.label_name==this.state.currentLabel ? 'btn btn-success':'btn btn-primary'} onClick={this.handleLabelClick}> {label.label_name} </button>
          ))}

          <div className='row'>
            
            <div className='col-sm'>
              <div className='float-right mb-3'>
                <SendTo studies={this.state.selectedRows} />
              </div>
              <TableMyDicomPatientsStudies 
                data={this.state.studies}
                onRowClick={this.onStudyRowClick}
                onSelect={this.onStudyCheckboxClick}
                rowStyle={this.rowStyleStudies}
              />
            </div>

            <div className='col-sm'>
              <TableMyDicomSeriesFillFromParent 
                studyID={this.state.currentStudyID}   
              />
            </div>

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
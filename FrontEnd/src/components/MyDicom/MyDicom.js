import React, { Component } from 'react'
import apis from '../../services/apis'
import { connect } from 'react-redux'
import TableMyDicomPatientsStudies from '../CommonComponents/RessourcesDisplay/ReactTable/TableMyDicomPatientsStudies'
import TableMyDicomSeriesFillFromParent from '../CommonComponents/RessourcesDisplay/ReactTable/TableMyDicomSeriesFillFromParent'
import SendTo from '../CommonComponents/RessourcesDisplay/SendToAnonExportDeleteDropdown'
import {Row, Col} from 'react-bootstrap'

class MyDicom extends Component{
  state = {
    role_name:this.props.roles.name,
    labels:[],
    username:this.props.username,
    studies:[],
    currentStudyID:null,
    currentLabel:null,
    selectedRows:[]
  }

  async componentDidMount(){
    try{
      await this.getRoleLabels()  
    }catch(err){console.log(err)}
  }

  /**
   * Recuperate labels associate to User's role
   */
  getRoleLabels = async () => {
    let label_tab = await apis.rolelabel.getRoleLabels(this.state.username,this.state.role_name)
    this.setState({
      labels:label_tab
    })
  }

  /**
   * Get all the studies linked to a label
   * @param {String} name label name
   * @returns [Array of StudyLabels]
   */
  getStudiesByLabel = async (name) => {
    return await apis.studylabel.getStudiesLabel(name)
  }

  /**
   * Action to do when user click on a label button
   * @param {*} e event to check
   */
  handleLabelClick = async (e) => {
    var label = e.target.name
    this.setState({currentLabel:label})
    var studies = await this.getStudiesByLabel(label)
    var studies_tab = []
    
    for(var i = 0;i<studies.length;i++){
      var study = studies[i]
      try{
        let study_details = await apis.content.getStudiesDetails(study.study_orthanc_id)
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
      }catch(err){}
    }

    this.setState({
      studies:studies_tab,
      currentStudyID:null,
      selectedRows:[]
    })
  }

  /**
   * Handle a click on row for Study
   * @param {JSON} row row values
   */
  onStudyRowClick = (row)=> {
    this.setState({ 
      currentStudyID: row.StudyOrthancID
    })
  }

  /**
   * Recuperate all the selected row on study tab when row is selected/unselected
   * @param {Array.<JSON>} tab 
   */
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

        <div>
          <Row className="border-bottom border-2 pb-3">
              <Col className="d-flex justify-content-start align-items-center">
                  <i className="far fa-images ico me-3"></i><h2 className="card-title">My Dicom</h2>
              </Col>
          </Row>
          <Row className="mt-5">
            <Col>
              {this.state.labels.map(label => (
                <button name={label.label_name} style={{margin: "5px",width:"30%"}} key={label.label_name} type='button' className={label.label_name===this.state.currentLabel ? 'otjs-button otjs-button-green':'otjs-button otjs-button-blue'} onClick={this.handleLabelClick}> {label.label_name} </button>
              ))}
            </Col>
          </Row>
          <Row className="mt-5">
            <Col sm>
              <TableMyDicomPatientsStudies 
                  data={this.state.studies}
                  onRowClick={this.onStudyRowClick}
                  onSelect={this.onStudyCheckboxClick}
                  rowStyle={this.rowStyleStudies}
                />
            </Col>
            <Col sm>
              <TableMyDicomSeriesFillFromParent 
                  studyID={this.state.currentStudyID}   
                />
            </Col>
          </Row>
          <Row className="mt-5">
            <Col>
              <SendTo studies={this.state.selectedRows} />
            </Col>
          </Row>
        </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    username: state.OrthancTools.username,
    roles: state.OrthancTools.roles
  }
}

export default connect(mapStateToProps)(MyDicom)
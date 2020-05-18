import React, { Fragment, Component, createRef } from 'react'
import SearchForm from './SearchForm'
import apis from '../../services/apis'

import Dropdown from 'react-bootstrap/Dropdown'

import TableSeriesFillFromParent from '../CommonComponents/RessourcesDisplay/TableSeriesFillFromParent'
import TablePatientsWithNestedStudies from '../CommonComponents/RessourcesDisplay/TablePatientsWithNestedStudies'

import {studyArrayToPatientArray} from '../../tools/processResponse'

import { connect } from 'react-redux'
import { addToDeleteList } from '../../actions/DeleteList'
import { addToExportList } from '../../actions/ExportList'
import { addToAnonList } from '../../actions/AnonList'
import { addOrthancContent, removeOrthancContentStudy, removeOrthancContentPatient } from '../../actions/OrthancContent'


class ContentRootPanel extends Component {

  state = {
    currentSelectedStudyId : ''
  }

  constructor(props){
    super(props)
    this.sendSearch = this.sendSearch.bind(this)
    this.onDeletePatient = this.onDeletePatient.bind(this)
    this.onDeleteStudy = this.onDeleteStudy.bind(this)
    this.sendToDeleteList = this.sendToDeleteList.bind(this)
    this.sendToExportList = this.sendToExportList.bind(this)
    this.sendToAnonList = this.sendToAnonList.bind(this)
    this.getStudySelectedDetails = this.getStudySelectedDetails.bind(this)
    this.child = createRef()
  }

  async sendSearch(dataFrom){
    let studies = await apis.content.getContent(dataFrom)
    this.props.addOrthancContent(studies)
  }

  //Rappelé par le dropdown lors du delete de Patietn sur Orthanc
  onDeletePatient(idDeleted){
    this.props.removeOrthancContentPatient(idDeleted)
    this.setState({currentSelectedStudyId: ''})
  }
  //rappelé par le dropdow lors du delete de study sur Orthanc
  onDeleteStudy(idDeleted){
    this.props.removeOrthancContentStudy(idDeleted)
    this.setState({currentSelectedStudyId: ''})
  }

  /**
   * return all study details
   * of selected items
   */
  getStudySelectedDetails(){
    let selectedIds = this.child.current.getSelectedRessources()
        
        let studiesOfSelectedPatients = []

        //Add all studies of selected patient
        selectedIds.selectedPatients.forEach(orthancPatientId => {
          //loop the redux and add all studies that had one of the selected patient ID
          let studyArray = this.props.orthancContent.filter(study => {
            if(study.ParentPatient === orthancPatientId) return true
            else return false
          })
          //Add to the global list of selected studies
          studiesOfSelectedPatients.push(...studyArray)
        })

        //add selected level studies
        selectedIds.selectedStudies.forEach(element => {
          this.props.orthancContent.forEach(study => {
            if(element === study.ID)
              studiesOfSelectedPatients.push(study)
          });
        });

        //Get only unique study ids
        let uniqueSelectedOrthancStudyId = [...new Set(studiesOfSelectedPatients)];

        return uniqueSelectedOrthancStudyId
  }

  sendToDeleteList(){
    this.props.addToDeleteList(this.getStudySelectedDetails())
  }

  sendToAnonList(){
    this.props.addToAnonList(this.getStudySelectedDetails())
  }

  async sendToExportList(){
    let selectedIds = this.child.current.getSelectedRessources()
    let studyIDs = []
    selectedIds.selectedPatients.forEach(orthancPatientId => {
      this.props.orthancContent.forEach(study => {
        if (study.ParentPatient === orthancPatientId)
          studyIDs.push(study.ID)
      })
    })
    selectedIds.selectedStudies.forEach(studyID => {
      if (!studyIDs.includes(studyID))
        studyIDs.push(studyID)
    })
    //get series details
    let serieDetails = []
    for(let i in studyIDs) {
      let series = await apis.content.getSeriesDetails(studyIDs[i])
      serieDetails.push(...series)
    }
    
    this.props.addToExportList(serieDetails, this.getStudySelectedDetails()) //send series details and study details

  }

  rowEventsStudies = {
    onClick: (e, row, rowIndex) => {
      this.setState({currentSelectedStudyId: row.StudyOrthancID})
    }
  }

  rowStyleStudies = (row, rowIndex) => {
    const style = {};
    if (row.StudyOrthancID === this.state.currentSelectedStudyId){
      style.backgroundColor = 'rgba(255,153,51)'
    }
    style.borderTop = 'none';

    return style;
  }

  handleClick(e){
    e.stopPropagation()
  }
  
  render() {
      return (
      <Fragment>
        <div className='jumbotron'>
          <SearchForm onSubmit={this.sendSearch} />
          <div className='row'>
          <div className='col-sm'>
              <Dropdown onClick={this.handleClick} className="float-right mb-3">
                  <Dropdown.Toggle variant="warning" id="dropdown-basic"  >
                      Send To
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <button className='dropdown-item bg-info' type='button' onClick={ this.sendToExportList } >Export List</button>
                    <button className='dropdown-item bg-primary' type='button' onClick={ this.sendToAnonList } >Anonymize List</button>
                    <button className='dropdown-item bg-danger' type='button' onClick={ this.sendToDeleteList } >Delete List</button>
                  </Dropdown.Menu>
              </Dropdown>
          
              
              <TablePatientsWithNestedStudies 
                    patients={studyArrayToPatientArray(this.props.orthancContent)} 
                    rowEventsStudies={ this.rowEventsStudies } 
                    rowStyle={ this.rowStyleStudies }
                    onDeletePatient={this.onDeletePatient} 
                    onDeleteStudy={this.onDeleteStudy}
                    setSelection={true}
                    ref={this.child}
              />
            </div>
            <div className='col-sm'>
                <TableSeriesFillFromParent studyID={this.state.currentSelectedStudyId} onDeleteStudy={this.onDeleteStudy} onEmptySeries={() => console.log('Plus de Series faire Refresh?')} />
            </div>
          </div>
        </div>
      </Fragment>
    )
  }

}

const mapStateToProps = state => {
  return {
    orthancContent: state.OrthancContent.orthancContent
  }
}

const mapDispatchToProps = {
  addToDeleteList,
  addToAnonList,
  addOrthancContent,
  removeOrthancContentStudy,
  removeOrthancContentPatient,
  addToExportList
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentRootPanel)
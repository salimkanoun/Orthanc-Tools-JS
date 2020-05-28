import React, { Fragment, Component, createRef } from 'react'
import SearchForm from './SearchForm'
import apis from '../../services/apis'

import Dropdown from 'react-bootstrap/Dropdown'

import TableSeriesFillFromParent from '../CommonComponents/RessourcesDisplay/TableSeriesFillFromParent'
import TablePatientsWithNestedStudies from '../CommonComponents/RessourcesDisplay/TablePatientsWithNestedStudies'

import {studyArrayToPatientArray, treeToStudyArray} from '../../tools/processResponse'

import { connect } from 'react-redux'
import { addStudiesToDeleteList } from '../../actions/DeleteList'
import { addStudiesToExportList } from '../../actions/ExportList'
import { addStudiesToAnonList } from '../../actions/AnonList'
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
    this.refreshSerie = this.refreshSerie.bind(this)
  }

  async sendSearch(dataFrom){
    let studies
    if (dataFrom){
      studies = await apis.content.getContent(dataFrom)
      this.setState({dataFrom: dataFrom})
    } else {
      studies = await apis.content.getContent(this.state.dataFrom)
    }
    
    this.props.addOrthancContent(studies)
  }

  refreshSerie(){
    let id = this.state.currentSelectedStudyId
    this.setState({
      currentSelectedStudyId: ''
    })
    this.setState({
      currentSelectedStudyId: id
    })
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
    this.props.addStudiesToDeleteList(this.getStudySelectedDetails())
  }

  sendToAnonList(){
    this.props.addStudiesToAnonList(this.getStudySelectedDetails())
  }

  async sendToExportList(){
    //Get selected studies array
    let selectedStudiesArray = treeToStudyArray(this.getStudySelectedDetails())
    //Send it to redux
    this.props.addStudiesToExportList(selectedStudiesArray) 
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
                    refresh={this.sendSearch}
              />
            </div>
            <div className='col-sm'>
                <TableSeriesFillFromParent studyID={this.state.currentSelectedStudyId} onDeleteStudy={this.onDeleteStudy} onEmptySeries={() => console.log('Plus de Series faire Refresh?')} refreshSerie={this.refreshSerie} />
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
  addStudiesToDeleteList,
  addStudiesToAnonList,
  addOrthancContent,
  removeOrthancContentStudy,
  removeOrthancContentPatient,
  addStudiesToExportList
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentRootPanel)
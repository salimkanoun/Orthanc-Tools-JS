import React, { Fragment, Component, createRef } from 'react'
import SearchForm from './SearchForm'
import apis from '../../services/apis'

import Dropdown from 'react-bootstrap/Dropdown'

import TableSeriesFillFromParent from '../CommonComponents/RessourcesDisplay/TableSeriesFillFromParent'
import TablePatientsWithNestedStudies from '../CommonComponents/RessourcesDisplay/TablePatientsWithNestedStudies'

import { connect } from 'react-redux'
import { addToDeleteList } from '../../actions/DeleteList'
import { addOrthancContent } from '../../actions/OrthancContent'


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
    this.child = createRef()
  }

  async sendSearch(dataFrom){
    let studies = await apis.content.getContent(dataFrom)
    let hirachicalAnswer = this.traitementStudies(studies)
    this.props.addOrthancContent(hirachicalAnswer)
  }

  prepareDataForTable(){
    let responseArray = this.props.orthancContent
    let answer = []
    for(let patient in responseArray) {
        answer.push( {
            PatientOrthancID  : patient,
            ...responseArray[patient]
        })
    }
    return answer
  }

  traitementStudies(studies){
      let responseMap = []
      studies.forEach(element => {
        let previewStudies = {}
        try {
          previewStudies = responseMap[element.ParentPatient].studies
        }
        catch (error) { }
          responseMap[element.ParentPatient] = {
            ...element.PatientMainDicomTags, 
            studies: {
              ...previewStudies,
              [element.ID]: {
                  ...element.MainDicomTags
              }
            }

          } 
              
        })
      return responseMap
      
  }

  //Rappelé par le dropdown lors du delete de Patietn sur Orthanc
  onDeletePatient(idDeleted){

  }
  //rappelé par le dropdow lors du delete de study sur Orthanc
  onDeleteStudy(idDeleted){

  }

  sendToDeleteList(){
    let selectedIds = this.child.current.getSelectedRessources()

    let studiesOfSelectedPatients = []

    //Add all studies of selected patient
    selectedIds.selectedPatients.forEach(orthancPatientId => {
      let patientsStudiesIdsArray = Object.keys(this.props.orthancContent[orthancPatientId]['studies'])
      studiesOfSelectedPatients.push(...patientsStudiesIdsArray)
    })

    //add selected level studies
    studiesOfSelectedPatients.push(...selectedIds.selectedStudies)

    //Get only unique study ids
    let uniqueSelectedOrthancStudyId = [...new Set(studiesOfSelectedPatients)];
    
    //SK Filtrer le state courrant en virant toutes les study non select et les patient ou l array des study =0
    console.log(selectedIds)
    console.log(uniqueSelectedOrthancStudyId)
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
                    patients={this.prepareDataForTable()} 
                    rowEventsStudies={ this.rowEventsStudies } 
                    onDeletePatient={this.onDeletePatient} 
                    onDeleteStudy={this.onDeleteStudy} 
                    ref={this.child}
              />
            </div>
            <div className='col-sm'>
                <TableSeriesFillFromParent studyID={this.state.currentSelectedStudyId} onEmptySeries={() => console.log('Plus de Series faire Refresh?')} />
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
  addOrthancContent
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentRootPanel)
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
    currentSelectedStudyId : "", 
    listToDelete : '', //list will be send to deleteTool
    selectedPatient: [], //list of all studyID of patient selected 
  } 

  constructor(props){
    super(props)
    this.sendSearch = this.sendSearch.bind(this)
    this.onDeletePatient = this.onDeletePatient.bind(this)
    this.onDeleteStudy = this.onDeleteStudy.bind(this)
    this.handleRowSelect = this.handleRowSelect.bind(this)
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
    this.setState({
      currentSelectedStudyId : ''
    })

  }

  sendToDeleteList(){
    
    //envoie la liste des items à delete 
    //On récupère tout les lignes des patients selectionné grace au donnée qui sont dans le store
    //On récupère ensuite les lignes des studies selectionnées 
    //On ajoute tout les patients dans la liste avec toutes leur studies
    //Ensuite pour chaque study, on regarde si son patient référent est déjà dans la liste ou pas
    //SI il est dedans on regarde si la study est déjà référencée dans le patient
    //si elle ne l'est pas on la rajoute sinon on fait rien
    //Si le patient référent n'a pas été trouvé on rajoute un nouveau patient. 

    let ids = this.child.current.getSelectedItems()
    let rowsPatient = []
    ids.forEach(id => {rowsPatient.push({...this.props.orthancContent[id], PatientOrthancID: id}); console.log(this.props.orthancContent[id])}) //Patient row to delete
    let rowsStudies = this.child.current.getSelectedStudies()
    let toDelete = []
    rowsPatient.forEach(row => {
      console.log(row)
      toDelete = [...toDelete, {id: row.PatientOrthancID, PatientName: row.PatientName, PatientID: row.PatientID, studies: row.studies}]
    })
    rowsStudies.forEach(study => {
      let find=false
      let studies = { [study.studyID]: {...study.row } }
      toDelete.forEach(patient =>{
        if (patient.id === study.row.PatientOrthancID){ //Si patient existant 
          find=true
          if (!Object.keys(patient.studies).includes(study.studyID)){ //si le study n'est pas déjà référencé dans le patient 
            patient.studies = {...patient.studies, ...studies}
          }
        }
      })
      if(!find)
        toDelete = [...toDelete, {id: study.row.PatientOrthancID, PatientName: study.row.PatientName, PatientID: study.row.PatientID, studies: {...studies}}]
    })

    toDelete.forEach(element => this.props.addToDeleteList(element)) //La liste evoyée est bien complète
  }
  

  handleRowSelect = (row, isSelected) => {
    if (row.StudyOrthancID === undefined){
        if (isSelected){
          this.setState({selectedPatient: [...this.state.selectedPatient, ...Object.keys(row.studies)]})
         }else {
          this.setState({selectedPatient: this.state.selectedPatient.filter(studyID => !Object.keys(row.studies).includes(studyID))})
         }
    }
  }

   rowEventsStudies = {
      onClick: (e, row, rowIndex) => {
        if (this.state.currentSelectedStudyId !== row.StudyOrthancID){
            this.setState({
              currentSelectedStudyId : row.StudyOrthancID
            })
        } else {
          this.setState({
            currentSelectedStudyId : ''
          })
        }
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
    const selectRow={
      mode: 'checkbox', 
      clickToExpand: true,
      nonSelectable: this.state.selectedPatient,
      onSelect: (row, isSelected) => this.handleRowSelect(row, isSelected),
      onSelectAll:  (isSelected, rows, e) => {
        rows.forEach((row) => this.handleRowSelect(row, isSelected))
      }
    }
    const selectStudyRow={
      mode: 'checkbox', 
      clickToExpand: true,
      nonSelectable: this.state.selectedPatient,
      onSelect: (row, isSelected) => console.log(row),
    }
      return (
      <Fragment>
        <div className='jumbotron'>
          <SearchForm onSubmit={this.sendSearch} />
          <Dropdown onClick={this.handleClick}>
                <Dropdown.Toggle variant="warning" id="dropdown-basic"  >
                    Send To
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <button className='dropdown-item bg-info' type='button' onClick={ this.sendToExportList } >Export List</button>
                  <button className='dropdown-item bg-primary' type='button' onClick={ this.sendToAnonList } >Anonymize List</button>
                  <button className='dropdown-item bg-danger' type='button' onClick={ this.sendToDeleteList } >Delete List</button>
                </Dropdown.Menu>
            </Dropdown>
          <div className='row'>
              <div className='col-sm'>
                   <TablePatientsWithNestedStudies 
                    patients={this.prepareDataForTable()} 
                    selectRow={selectRow }
                    selectStudyRow={selectStudyRow}
                    selectedPatient={this.state.selectedPatient}
                    rowEventsStudies={ this.rowEventsStudies } 
                    onDeletePatient={this.onDeletePatient} 
                    onDeleteStudy={this.onDeleteStudy} 
                    rowStyleStudies={this.rowStyleStudies}
                    selectedID={this.state.selectedPatient}
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
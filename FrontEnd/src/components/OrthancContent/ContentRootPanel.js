import React, { Fragment, Component } from 'react'
import SearchForm from './SearchForm'
import apis from '../../services/apis'

import TableSeriesFillFromParent from '../CommonComponents/RessourcesDisplay/TableSeriesFillFromParent'
import TablePatientsWithNestedStudies from '../CommonComponents/RessourcesDisplay/TablePatientsWithNestedStudies'

import { connect } from 'react-redux'
import { addToDeleteList } from '../../actions/DeleteList'


class ContentRootPanel extends Component {

  /*

  Il faut gérer les select, si un patient est select, toutes ses studies doivent alors être selected
  Lorsqu'on click sur send to delete, il faudrait que la table entière se deselecte ? 
  ou
  Il faut que les element qui sont dans la liste des delete soient automatiquement selected et disabled => enable lorqu'ils sont pas dans la liste 

  Lors de l'envoie vers la state global, il y a déjà une verification qui empeche les doublons dans la liste
  
  */

  state = {
    studies: [], 
    currentSelectedStudyId : "", 
    listToDelete : '' //list will be send to deleteTool
  } 

  constructor(props){
    super(props)
    this.sendSearch = this.sendSearch.bind(this)
    this.onDeletePatient = this.onDeletePatient.bind(this)
    this.onDeleteStudy = this.onDeleteStudy.bind(this)
    this.handleRowSelect = this.handleRowSelect.bind(this)
    this.sendToDeleteList = this.sendToDeleteList.bind(this)
  }


  async sendSearch(dataFrom){
    let studies = await apis.content.getContent(dataFrom)
    let hirachicalAnswer = this.traitementStudies(studies)
    let dataForPatientTable = this.prepareDataForTable(hirachicalAnswer)
    console.log(dataForPatientTable)
    this.setState({ studies: dataForPatientTable })
  }


  prepareDataForTable(responseArray){
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
    console.log(studies);
    
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

  onDeletePatient(idDeleted){


  }

  onDeleteStudy(idDeleted){
    this.setState({
      currentSelectedStudyId : ''
    })

  }

  selectRow={
    mode: 'checkbox', 
    clickToExpand: true,
    onSelect: (row, isSelected) => this.handleRowSelect(row, isSelected),
    onSelectAll: (isSelected, rows, e) => {
      rows.forEach((row) => this.handleRowSelect(row, isSelected))
    }
  }

  sendToDeleteList(){
    if(this.state.listToDelete !== '')
      this.state.listToDelete.forEach(element => this.props.addToDeleteList(element)) //send listToDelete to the redux store
    else
      console.log("empty");
      
  }
  
  handleRowSelect = (row, isSelected) => {
    let level = ''
    let id = ''
    let studies = {}
    let parentID = ''
    if (row.PatientOrthancID !== undefined){
      level = 'patients'
      id = row.PatientOrthancID
      studies = row.studies
    }
    if (row.StudyOrthancID !== undefined){
      level = 'studies'
      id = row.StudyOrthancID
      parentID = row.PatientOrthancID
    }
    if (isSelected)
      this.setState({listToDelete: [...this.state.listToDelete, {level: level, id: id, studies: studies, parentID: parentID, row: row}]}) //ajoute l'id et le level au state 
    else
      this.setState({listToDelete: this.state.listToDelete.filter(obj => obj.id !== id)})
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
  
  render() {
      return (
      <Fragment>
        <div className='jumbotron'>
          <SearchForm onSubmit={this.sendSearch} />
          <input type='button' className='btn btn-danger mb-3' onClick={this.sendToDeleteList} value='To Delete List' />   
          <div className='row'>
              <div className='col-sm'>
                   <TablePatientsWithNestedStudies 
                    patients={this.state.studies} 
                    selectRow={ this.selectRow } 
                    rowEventsStudies={ this.rowEventsStudies } 
                    onDeletePatient={this.onDeletePatient} 
                    onDeleteStudy={this.onDeleteStudy} 
                    rowStyleStudies={this.rowStyleStudies} 
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
    deleteList: state.deleteList
  }
}

const mapDispatchToProps = {
  addToDeleteList
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentRootPanel)
import React, {Component} from 'react'

import Dropdown from 'react-bootstrap/Dropdown'
import {treeToStudyArray} from '../../../tools/processResponse'

import {connect} from 'react-redux'
import {addStudiesToDeleteList} from '../../../actions/DeleteList'
import {addStudiesToExportList} from '../../../actions/ExportList'
import {addStudiesToAnonList} from '../../../actions/AnonList'

/*
* props :
*     - studies : an array on OrthancID
*     - patients : an array of PatientID
*/

class SendToAnonExportDeleteDropwdown extends Component {

    getStudySelectedDetails = () => {
      let selectedIds = {}
      selectedIds.selectedPatients=this.props.patients || []
      selectedIds.selectedStudies=this.props.studies || []

      console.log(selectedIds.selectedPatients)
      let studiesOfSelectedPatients = []

      //Add all studies of selected patient
      selectedIds.selectedPatients.forEach(orthancPatientId => {
        //loop the redux and add all studies that had one of the selected patient ID
        let studyArray = this.props.orthancContent.filter(study => {
            if (study.ParentPatient === orthancPatientId) return true
            else return false
        })
        //Add to the global list of selected studies
        studiesOfSelectedPatients.push(...studyArray)
      })

        //add selected level studies
        selectedIds.selectedStudies.forEach(element => {
          this.props.orthancContent.forEach(study => {
              if (element === study.ID)
                  studiesOfSelectedPatients.push(study)
          });
      });
      //Get only unique study ids
      let uniqueSelectedOrthancStudyId = [...new Set(studiesOfSelectedPatients)];

      return uniqueSelectedOrthancStudyId
    }

    sendToDeleteList = () => {
        this.props.addStudiesToDeleteList(this.getStudySelectedDetails())
    }

    sendToAnonList = () => {
        this.props.addStudiesToAnonList(this.getStudySelectedDetails())
    }

    sendToExportList = async () => {
        //Get selected studies array
        let selectedStudiesArray = treeToStudyArray(this.getStudySelectedDetails())
        //Send it to redux
        this.props.addStudiesToExportList(selectedStudiesArray)
    }

    handleClick = (e) => {
      e.stopPropagation()
    }


  render = () => {
    return(
    <Dropdown onClick={this.handleClick}>
        <Dropdown.Toggle variant="warning" id="dropdown-basic">
            Send To
        </Dropdown.Toggle>

        <Dropdown.Menu>
            <Dropdown.Item className='bg-primary' onClick={this.sendToExportList}>Export List</Dropdown.Item>
            <Dropdown.Item className='bg-info' onClick={this.sendToAnonList}>Anonymize List</Dropdown.Item>
            <Dropdown.Item className='bg-danger' onClick={this.sendToDeleteList}>Delete List</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
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
  addStudiesToExportList
}

export default connect(mapStateToProps, mapDispatchToProps)(SendToAnonExportDeleteDropwdown)
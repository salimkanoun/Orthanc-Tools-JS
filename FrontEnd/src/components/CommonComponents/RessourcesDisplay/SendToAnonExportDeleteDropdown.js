import React, { Component } from 'react'

import { ButtonGroup, Dropdown } from 'react-bootstrap'
import { treeToStudyArray } from '../../../tools/processResponse'

import { connect } from 'react-redux'
import { addStudiesToDeleteList } from '../../../actions/DeleteList'
import { addStudiesToExportList } from '../../../actions/ExportList'
import { addStudiesToAnonList } from '../../../actions/AnonList'

import apis from '../../../services/apis'

/*
* props :
*     - studies : an array on OrthancID
*     - patients : an array of PatientID
*/


export function SendToAnonExportDeleteDropwdown(props) {
    /**
     * Make a common array from all the studies selected
     * @returns {Array.<JSON>} Selected studies
     */

    const getStudySelectedDetails = async () => {
        let selectedIds = {}
        selectedIds.selectedPatients = props.patients || []
        selectedIds.selectedStudies = props.studies || []

        let studiesOfSelectedPatients = []

        //Add all studies of selected patient
        for (let i = 0; i < selectedIds.selectedPatients.length; i++) {
            let studyArray = await apis.content.getPatientDetails(selectedIds.selectedPatients[i])
            for (var j = 0; j < studyArray.Studies.length; j++) {
                let study = await apis.content.getStudiesDetails(studyArray.Studies[j])
                studiesOfSelectedPatients.push(study)
            }
        }

        //add selected level studies
        for (let i = 0; i < selectedIds.selectedStudies.length; i++) {
            let study = await apis.content.getStudiesDetails(selectedIds.selectedStudies[i])
            studiesOfSelectedPatients.push(study)
        }

        //Get only unique study ids

        let uniqueSelectedOrthancStudyId = []
        for (let i = 0; i < studiesOfSelectedPatients.length; i++) {
            var count = 0
            for (let j = 0; j < studiesOfSelectedPatients.length; j++) {
                if (studiesOfSelectedPatients[i].ID === studiesOfSelectedPatients[j].ID) count++
            }
            if (count === 1) {
                uniqueSelectedOrthancStudyId.push(studiesOfSelectedPatients[i])
            } else {
                let countU = 0
                for (let k = 0; k < uniqueSelectedOrthancStudyId.length; k++) {
                    if (studiesOfSelectedPatients[i].ID === uniqueSelectedOrthancStudyId[k].ID) countU++
                }
                if (countU === 0) uniqueSelectedOrthancStudyId.push(studiesOfSelectedPatients[i])
            }
        }
        console.log(uniqueSelectedOrthancStudyId)

        return uniqueSelectedOrthancStudyId
    }

    const sendToDeleteList = async () => {
        let studies = (props.studiesFull || await this.getStudySelectedDetails())
        props.addStudiesToDeleteList(studies)
    }

    const sendToAnonList = async () => {
        let studies = (props.studiesFull || await this.getStudySelectedDetails())
        props.addStudiesToAnonList(studies)
    }

    const sendToExportList = async () => {
        let studies = (props.studiesFull || await getStudySelectedDetails())
        //Get selected studies array
        let selectedStudiesArray = treeToStudyArray(studies)
        //Send it to redux
        props.addStudiesToExportList(selectedStudiesArray)
    }

    const handleClick = (e) => {
        e.stopPropagation()
    }


    return (
        <Dropdown as={ButtonGroup} onClick={this.handleClick}>
            <Dropdown.Toggle variant="button-dropdown-orange" className="mb-4 button-dropdown button-dropdown-orange" id="dropdown-basic">
                Send To
            </Dropdown.Toggle>

            <Dropdown.Menu className="mt-2 border border-dark border-2">
                <Dropdown.Item className='bg-blue' onClick={this.sendToExportList}>Export List</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className='bg-orange' onClick={this.sendToAnonList}>Anonymize List</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className='bg-red' onClick={this.sendToDeleteList}>Delete List</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

//utiliser les hooks
const mapDispatchToProps = {
    addStudiesToDeleteList,
    addStudiesToAnonList,
    addStudiesToExportList
}

export default connect(null, mapDispatchToProps)(SendToAnonExportDeleteDropwdown)
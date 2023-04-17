import React, { useState } from 'react'
import apis from '../../services/apis'
import { useSelector } from 'react-redux'
import TableMyDicomPatientsStudies from '../CommonComponents/RessourcesDisplay/ReactTable/TableMyDicomPatientsStudies'
import TableMyDicomSeriesFillFromParent from '../CommonComponents/RessourcesDisplay/ReactTable/TableMyDicomSeriesFillFromParent'
import { Row, Col, Button } from 'react-bootstrap'

export default ({ roles, usernameProps }) => {

  const store = useSelector(state => {
    return {
      username: state.OrthancTools.username,
      roles: state.OrthancTools.roles
    }
  })

  const [role_name, setRole_name] = useState(roles.name);
  const [labels, setLabels] = useState([]);
  const [username, setUsername] = useState(usernameProps);
  const [studies, setStudies] = useState([]);
  const [currentStudyID, setCurrentStudyID] = useState(null);
  const [currentLabel, setCurrentLabel] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const componentDidMount = async () => {
    try {
      await getRoleLabels(role_name)
    } catch (err) { console.log(err) }
  }

  /**
   * Recuperate labels associate to User's role
   */
  const getRoleLabels = async () => {
    let label_tab = await apis.rolelabel.getRoleLabels(role_name)
    setLabels(label_tab)
  }

  /**
   * Get all the studies linked to a label
   * @param {String} name label name
   * @returns [Array of StudyLabels]
   */
  const getStudiesByLabel = async (name) => {
    return await apis.studylabel.getStudiesLabel(name)
  }

  /**
   * Action to do when user click on a label button
   * @param {*} e event to check
   */
  const handleLabelClick = async (e) => {
    var label = e.target.name
    setCurrentLabel(label)
    var studies = await getStudiesByLabel(label)
    var studies_tab = []

    for (var i = 0; i < studies.length; i++) {
      var study = studies[i]
      try {
        let study_details = await apis.content.getStudiesDetails(study.study_orthanc_id)
        let row = {
          StudyOrthancID: study_details.ID,
          StudyInstanceUID: study_details.MainDicomTags.StudyInstanceUID,
          PatientID: study_details.PatientMainDicomTags.PatientID,
          PatientName: study_details.PatientMainDicomTags.PatientName,
          StudyDate: study_details.MainDicomTags.StudyDate,
          StudyDescription: study_details.MainDicomTags.StudyDescription,
          AccessionNumber: study_details.MainDicomTags.AccessionNumber
        }
        studies_tab.push(row)
      } catch (err) { }
    }

    setStudies(studies_tab)
    setCurrentStudyID(null)
    setSelectedRows([])
  }

  /**
   * Handle a click on row for Study
   * @param {JSON} row row values
   */
  const onStudyRowClick = (row) => {
    setCurrentStudyID(row.StudyOrthancID)
  }

  /**
   * Recuperate all the selected row on study tab when row is selected/unselected
   * @param {Array.<JSON>} tab 
   */
  const onStudyCheckboxClick = (tab) => {
    var selectedRows = []
    for (var i = 0; i < tab.length; i++) {
      selectedRows.push(tab[i].values.StudyOrthancID)
    }
    setSelectedRows(selectedRows)
  }

  const rowStyleStudies = (row) => {
    var style = ''
    if (row.StudyOrthancID === currentStudyID) {
      style = 'rgba(255,153,51)'
    }

    return style;
  }


  return (

    <div>
      <Row className="border-bottom border-2 pb-3">
        <Col className="d-flex justify-content-start align-items-center">
          <i className="far fa-images ico me-3"></i><h2 className="card-title">My Dicom</h2>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          {labels.map(label => (
            <Button name={label.label_name} style={{ margin: "5px", width: "30%" }} key={label.label_name} className={label.label_name === currentLabel ? 'otjs-button otjs-button-green' : 'otjs-button otjs-button-blue'} onClick={handleLabelClick}> {label.label_name} </Button>
          ))}
        </Col>
      </Row>
      <Row className="mt-5">
        <Col sm>
          <TableMyDicomPatientsStudies
            data={studies}
            onRowClick={onStudyRowClick}
            onSelect={onStudyCheckboxClick}
            rowStyle={rowStyleStudies}
          />
        </Col>
        <Col sm>
          <TableMyDicomSeriesFillFromParent
            studyID={currentStudyID}
          />
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>

        </Col>
      </Row>
    </div>
  )

} 

import React, { useState } from 'react'
import Select from 'react-select'
import { useCustomMutation, useCustomQuery } from '../../../services/ReactQuery/hooks'
import apis from '../../../services/apis'
import { Button, Container, Row } from 'react-bootstrap'
import { keys } from '../../../model/Constant'
import { successMessage } from '../../../tools/toastify'


export default ({ selectedOrthancStudyIds }) => {

    const [selectedLabel, setSelectedLabel] = useState(null)

    const { data: availableLabels } = useCustomQuery(
        [keys.LABELS_KEY],
        () => apis.label.getAllLabels(),
        undefined,
        (labels) => labels.map(label => ({ value: label, label: label }))
    )

    const addLabelMutation = useCustomMutation(
        ({ studyOrthancID, labelName }) => apis.studylabel.addLabelToOrthancStudy(studyOrthancID, labelName),
        []
    )

    const removeLabelMutation = useCustomMutation(
        ({ studyOrthancID, labelName }) => apis.studylabel.removeLabelToOrthancStudy(studyOrthancID, labelName),
        []
    )

    const addTagHandler = () => {
        for (const studyOrthancID of selectedOrthancStudyIds) {
            addLabelMutation.mutate({ studyOrthancID: studyOrthancID, labelName: selectedLabel.value })
        }
        successMessage('Label add')
    }

    const removeTagHandler = () => {
        for (const studyOrthancID of selectedOrthancStudyIds) {
            removeLabelMutation.mutate({ studyOrthancID: studyOrthancID, labelName: selectedLabel.value })
        }
        successMessage('Label removed')
    }

    if (selectedOrthancStudyIds.length === 0) return 'No selected studies to be assigned'

    return (
        <Container fluid>
            <Row className='mb-3'>
                <Select isClearable options={availableLabels} value={selectedLabel} onChange={(option) => setSelectedLabel(option)} />
            </Row>
            <Row>
                <div className="d-flex justify-content-around">
                <Button variant='primary' disabled={selectedLabel == null} onClick={() => addTagHandler()}>Add Label for all selected ressource</Button>
                <Button variant='danger' disabled={selectedLabel == null} onClick={() => removeTagHandler()}>Delete Label for all selected ressource</Button>
                </div>
            </Row>
        </Container>
    )
}
import React from 'react'

import { useCustomMutation, useCustomQuery } from '../../services/ReactQuery/hooks'
import Spinner from '../CommonComponents/Spinner'

import apis from '../../services/apis'
import { keys } from '../../model/Constant'
import { Button } from 'react-bootstrap'

export default ({ studyOrthancID }) => {

    const { data: availableLabels, isLoading: isLoadingAvailableLabels } = useCustomQuery(
        [keys.LABELS_KEY],
        () => apis.label.getAllLabels()
    )

    const { data: labels, isLoading: isLoadingLabels } = useCustomQuery(
        [keys.STUDY_KEY, studyOrthancID, keys.LABELS_KEY],
        () => apis.studylabel.getOrthancStudyLabels(studyOrthancID)
    )

    const addLabelMutation = useCustomMutation(
        ({ labelName }) => apis.studylabel.addLabelToOrthancStudy(studyOrthancID, labelName),
        [[keys.STUDY_KEY, studyOrthancID, keys.LABELS_KEY]]
    )

    const removeLabelMutation = useCustomMutation(
        ({ labelName }) => apis.studylabel.removeLabelToOrthancStudy(studyOrthancID, labelName),
        [[keys.STUDY_KEY, studyOrthancID,keys.LABELS_KEY]]
    )

    if (isLoadingLabels || isLoadingAvailableLabels) return <Spinner />

    const isActivatedLabel = (label) => {
        return labels?.includes(label)
    }

    return (
        <div className='d-flex justify-content-around'>
            {availableLabels.map((labelName) => {
                return (
                    <Button
                        variant={isActivatedLabel(labelName) ? 'info' : 'success'}
                        onClick={() => {
                            if (isActivatedLabel(labelName)) {
                                removeLabelMutation.mutate({ labelName })
                            } else {
                                addLabelMutation.mutate({ labelName })
                            }
                        }}
                        key={labelName}>
                        {labelName}
                    </Button>
                )
            })}
        </div>
    )
}
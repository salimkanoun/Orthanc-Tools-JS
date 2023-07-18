import React, { useState, useEffect } from 'react'
import { Container, Row } from 'react-bootstrap';

import apis from '../../services/apis'

import MetadataTable from './MetadataTable';
import MetadataSelector from './MetadataSelector';

export default ({ seriesOrthancId }) => {

    const [data, setData] = useState([])
    const [instancesArray, setInstancesArray] = useState([])
    const [currentKey, setCurrentKey] = useState(0)
    const [sharedTags, setSharedTags] = useState(false)

    useEffect(() => {
        apis.content.getSeriesDetailsByID(seriesOrthancId).then((answer) => {
            let instances = answer['Instances']
            setInstancesArray(instances)
        })
    }, [])

    useEffect(() => {

        const prepareData = (data) => {
            let answer = []
            for (let dicomTag of Object.keys(data).sort()) {
                let tagName = data[dicomTag]['Name']
                let value = data[dicomTag]['Value']

                let answerData = {
                    dicomTag: dicomTag,
                    name: tagName
                }
                if (Array.isArray(value)) {
                    answerData['value'] = value.map(node => prepareData(node))
                } else {
                    answerData['value'] = value
                }

                answer.push(answerData)
            }
            return answer
        }

        const fetchData = async () => {
            if (instancesArray.length === 0) return
            let currentInstanceId = instancesArray[currentKey]
            let responsetags = []

            if (sharedTags) {
                responsetags = await apis.content.getSharedTags(seriesOrthancId)
            }
            else {
                let instances = await apis.content.getInstances(currentInstanceId)
                let header = await apis.content.getHeader(currentInstanceId)
                responsetags = { ...instances, ...header }
            }


            const formattedData = prepareData(responsetags)
            setData(formattedData)
        }

        fetchData()

    }, [currentKey, sharedTags, instancesArray])

    const onInstanceNumberChange = (instanceNumber) => {
        setCurrentKey(instanceNumber)
    }

    const onSharedTagsChange = () => {
        setSharedTags((sharedTags) => !sharedTags)
    }


    return (
        <Container>
            <Row>
                <MetadataSelector
                    currentInstanceNumber={currentKey}
                    numberOfInstances={instancesArray.length}
                    useSharedTags={sharedTags}
                    onInstanceNumberChange={onInstanceNumberChange}
                    onSharedTagsChange={onSharedTagsChange}
                />
            </Row>
            <Row>
                <MetadataTable tags={data} />
            </Row>
        </Container>
    );

}
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Container, Row } from 'react-bootstrap'

import MyDicomStudiesTable from './MyDicomStudiesTable'
import MyDicomSeriesTable from './MyDicomSeriesTable'

import { useCustomQuery } from '../../services/ReactQuery/hooks'
import { keys } from '../../model/Constant'
import { addStudiesToExportList } from '../../actions/ExportList'
import Spinner from '../CommonComponents/Spinner'
import Study from '../../model/Study'
import Series from '../../model/Series'
import apis from '../../services/apis'

export default () => {

    const [selectedTag, setSelectedTag] = useState(null)
    const [activeStudy, setActiveStudy] = useState(null)
    const [selectedStudies, setSelectedStudies] = useState([])
    const [studies, setStudies] = useState([])
    const [series, setSeries] = useState([])

    const store = useSelector(state => {
        return {
            username: state.OrthancTools.username,
            roleName: state.OrthancTools.name
        }
    })

    const dispatch = useDispatch()

    const onSelectStudy = (selectedStudies) => {
        let selectedStudiesOrthancId = selectedStudies.map((StudyOrthancID => {
            return StudyOrthancID
        }))
        setSelectedStudies(selectedStudiesOrthancId)
    }

    const { data: labels, isLoading } = useCustomQuery(
        [keys.ROLES_KEY, store.roleName, keys.LABELS_KEY],
        () => apis.rolelabel.getRoleLabels(store.roleName)
    )

    const getStudies = async () => {
        let studies = await apis.content.getStudiesWithLabel(selectedTag)
        let rows = studies.map((study) => {
            let studyObject = new Study()
            studyObject.fillFromOrthanc(study.ID, study.MainDicomTags, study.Series)
            studyObject.fillParentPatient(study.ParentPatient, study.PatientMainDicomTags)
            return studyObject.serialize()
        })
        setStudies(rows)
    }

    const getSeriesOfStudy = async (activeStudy) => {
        let series = await apis.content.getSeriesDetailsOfStudy(activeStudy)
        let seriesObjects = series.map(series => {
            let seriesObject = new Series()
            seriesObject.fillFromOrthanc(series.ID, series.MainDicomTags, series.Instances, series.ParentStudy)
            return seriesObject.serialize()
        })
        setSeries(seriesObjects)
    }

    useEffect(() => {
        if (activeStudy) getSeriesOfStudy(activeStudy)
    }, [activeStudy])

    useEffect(() => {
        if (selectedTag) getStudies()
    }, [selectedTag])

    const onSelectTagHandle = (tagName) => {
        setSelectedTag(tagName)
        setSeries([])
        setActiveStudy(null)
    }

    const getVariant = (tagName) => {
        if (tagName === selectedTag) return 'warning'
        else 'primary'
    }

    const onSendExport = () => {
        let selectedStudiesObject = studies.filter(study => selectedStudies.includes(study.StudyOrthancID))
        dispatch(addStudiesToExportList(selectedStudiesObject))
    }

    if (isLoading) return <Spinner />

    return (
        <Container fluid>
            <Row>
                <Col className="d-flex justify-content-start align-items-center">
                    <i className="fas fa-images ico me-3"></i>
                    <h2 className="card-title">My Dicom</h2>
                </Col>
            </Row>
            <Row>
                <div className="d-flex justify-content-around">
                    {labels.map(label => <Button variant={getVariant(label)} onClick={() => onSelectTagHandle(label)}>{label}</Button>)}
                </div>
            </Row>
            <Row>
            <Button className="otjs-button otjs-button-orange w-10 m-3" onClick={() => onSendExport()} >To Export</Button>
            </Row>
            <Row>
                <Col>
                    <MyDicomStudiesTable studies={studies} onClickStudy={(studyOrthancId) => setActiveStudy(studyOrthancId)} onSelectStudy={onSelectStudy} selectedStudies={selectedStudies} />
                </Col>
                <Col>
                    <MyDicomSeriesTable series={series} />
                </Col>
            </Row>
        </Container>
    )
}
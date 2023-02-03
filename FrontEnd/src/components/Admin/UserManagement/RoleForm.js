import React, { Component, Fragment, useEffect, useState } from 'react'
import Toggle from 'react-toggle'
import { Row, Col, Button } from 'react-bootstrap'

export default ({ data, onSubmitRole }) => {

    const [stateImport, setStateImport] = useState(false)
    const [content, setContent] = useState(false)
    const [anon, setAnon] = useState(false)
    const [export_local, setExport_local] = useState(false)
    const [export_extern, setExport_extern] = useState(false)
    const [query, setQuery] = useState(false)
    const [auto_query, setAuto_query] = useState(false)
    const [stateDelete, setStateDelete] = useState(false)
    const [admin, setAdmin] = useState(false)
    const [modify, setModify] = useState(false)
    const [cd_burner, setCd_burner] = useState(false)
    const [autorouting, setAutorouting] = useState(false)

    const state = ({
        import: stateImport,
        content: content,
        anon: anon,
        export_local: export_local,
        export_extern: export_extern,
        query: query,
        auto_query: auto_query,
        delete: stateDelete,
        admin: admin,
        modify: modify,
        cd_burner: cd_burner,
        autorouting: autorouting,
    }, [stateImport, content, anon, export_local, export_extern, query, auto_query, stateDelete, admin, modify, cd_burner, autorouting])


    useEffect(() => {
        if (data != null) {

            setStateImport(data.import)
            setContent(data.content)
            setAnon(data.anon)
            setExport_local(data.export_local)
            setExport_extern(data.export_extern)
            setQuery(data.query)
            setAuto_query(data.auto_query)
            setStateDelete(data.delete)
            setAdmin(data.admin)
            setModify(data.modify)
            setCd_burner(data.cd_burner)
            setAutorouting(data.autorouting)
        }
    }, [])


    return (
        <Fragment>
            <Row className="mt-3">
                <Col sm={5}>
                    <h5>Administration</h5>
                </Col>
                <Col sm={7}>
                    <Toggle checked={admin} onChange={() => setAdmin(!admin)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col sm={5}>
                    <h5>Anonymisation</h5>
                </Col>
                <Col sm={7}>
                    <Toggle checked={anon} onChange={() => setAnon(!anon)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col sm={5}>
                    <h5>Auto-Query</h5>
                </Col>
                <Col sm={7}>
                    <Toggle checked={auto_query} onChange={() => setAuto_query(!auto_query)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col sm={5}>
                    <h5>Content</h5>
                </Col>
                <Col sm={7}>
                    <Toggle checked={content} onChange={() => setContent(!content)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col sm={5}>
                    <h5>Delete</h5>
                </Col>
                <Col sm={7}>
                    <Toggle checked={stateDelete} onChange={() => setStateDelete(!stateDelete)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col sm={5}>
                    <h5>Local Export</h5>
                </Col>
                <Col sm={7}>
                    <Toggle checked={export_local} onChange={() => setExport_local(!export_local)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col sm={5}>
                    <h5>Remote Export</h5>
                </Col>
                <Col sm={7}>
                    <Toggle checked={export_extern} onChange={() => setExport_extern(!export_extern)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col sm={5}>
                    <h5>Query</h5>
                </Col>
                <Col sm={7}>
                    <Toggle checked={query} onChange={() => setQuery(!query)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col sm={5}>
                    <h5>Import</h5>
                </Col>
                <Col sm={7}>
                    <Toggle checked={stateImport} onChange={() => setStateImport(!stateImport)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col sm={5}>
                    <h5>Modify</h5>
                </Col>
                <Col sm={7}>
                    <Toggle checked={modify} onChange={() => setModify(!modify)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col sm={5}>
                    <h5>CD Burner</h5>
                </Col>
                <Col sm={7}>
                    <Toggle checked={cd_burner} onChange={() => setCd_burner(!cd_burner)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col sm={5}>
                    <h5>Dicom Router</h5>
                </Col>
                <Col sm={7}>
                    <Toggle checked={autorouting} onChange={() => setAutorouting(!autorouting)} />
                </Col>
            </Row>

            <Row className="mt-3 text-center">
                <Col>
                    <Button name='create' className='otjs-button otjs-button-blue' onClick={() => { onSubmitRole(state) }}> Validate </Button>
                </Col>
            </Row>

        </Fragment>
    );
}
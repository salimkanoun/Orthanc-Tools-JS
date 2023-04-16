import React, { Fragment, useEffect, useState } from 'react'
import Toggle from 'react-toggle'
import { Row, Col, Button } from 'react-bootstrap'

export default ({ data, onSubmitRole }) => {

    const [state, setState] = useState({
        import: false,
        content: false,
        anon: false,
        export_local: false,
        export_extern: false,
        query: false,
        auto_query: false,
        delete: false,
        admin: false,
        modify: false,
        cd_burner: false,
        autorouting: false,
    })

    useEffect(() => {
        if (data != null) {
            setState({
                import: data.import,
                content: data.content,
                anon: data.anon,
                export_local: data.export_local,
                export_extern: data.export_extern,
                query: data.query,
                auto_query: data.auto_query,
                delete: data.delete,
                admin: data.admin,
                modify: data.modify,
                cd_burner: data.cd_burner,
                autorouting: data.autorouting
            })
        }
    }, [JSON.stringify(data)])


    const onChange = (key, event) => {
        setState((state) => ({
            ...state,
            [key]: event
        })
        )
    }


    return (
        <Fragment>
            <Row className="mt-3">
                <Col sm={5}>
                    <h5>Administration</h5>
                </Col>
                <Col sm={7}>
                    <Toggle checked={state.admin} onChange={() => onChange('admin', !state.admin)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col sm={5}>
                    <h5>Anonymisation</h5>
                </Col>
                <Col sm={7}>
                    <Toggle checked={state.anon} onChange={() => onChange('anon', !state.anon)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col sm={5}>
                    <h5>Auto-Query</h5>
                </Col>
                <Col sm={7}>
                    <Toggle checked={state.auto_query} onChange={() => onChange('auto_query', !state.auto_query)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col sm={5}>
                    <h5>Content</h5>
                </Col>
                <Col sm={7}>
                    <Toggle checked={state.content} onChange={() => onChange('content', !state.content)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col sm={5}>
                    <h5>Delete</h5>
                </Col>
                <Col sm={7}>
                    <Toggle checked={state.delete} onChange={() => onChange('delete', !state.delete)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col sm={5}>
                    <h5>Local Export</h5>
                </Col>
                <Col sm={7}>
                    <Toggle checked={state.export_local} onChange={() => onChange('export_local', !state.export_local)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col sm={5}>
                    <h5>Remote Export</h5>
                </Col>
                <Col sm={7}>
                    <Toggle checked={state.export_extern} onChange={() => onChange('export_extern', !state.export_extern)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col sm={5}>
                    <h5>Query</h5>
                </Col>
                <Col sm={7}>
                    <Toggle checked={state.query} onChange={() => onChange('query', !state.query)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col sm={5}>
                    <h5>Import</h5>
                </Col>
                <Col sm={7}>
                    <Toggle checked={state.import} onChange={() => onChange('import', !state.import)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col sm={5}>
                    <h5>Modify</h5>
                </Col>
                <Col sm={7}>
                    <Toggle checked={state.modify} onChange={() => onChange('modify', !state.modify)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col sm={5}>
                    <h5>CD Burner</h5>
                </Col>
                <Col sm={7}>
                    <Toggle checked={state.cd_burner} onChange={() => onChange('cd_burner', !state.cd_burner)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col sm={5}>
                    <h5>Dicom Router</h5>
                </Col>
                <Col sm={7}>
                    <Toggle checked={state.autorouting} onChange={() => onChange('autorouting', !state.autorouting)} />
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
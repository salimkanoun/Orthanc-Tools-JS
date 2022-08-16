import React, { Component, Fragment } from 'react'
import Toggle from 'react-toggle'
import {Row, Col} from 'react-bootstrap'
export default class RoleForm extends Component {

    state = {
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
        autorouting:false,
    }

    componentDidMount = () => {

        if (this.props.data != null) {

            this.setState(
                {
                    import: this.props.data.import,
                    content: this.props.data.content,
                    anon: this.props.data.anon,
                    exportLocal: this.props.data.export_local,
                    exportExtern: this.props.data.export_extern,
                    query: this.props.data.query,
                    autoQuery: this.props.data.auto_query,
                    delete: this.props.data.delete,
                    admin: this.props.data.admin,
                    modify: this.props.data.modify,
                    cd_burner: this.props.data.cd_burner,
                    autorouting:this.props.data.autorouting,
                }
            )

        }

    }

    render = () => {
        return (
            <Fragment>
                <Row className="mt-3">
                    <Col sm={5}>
                        <h5>Quản trị</h5>
                    </Col>
                    <Col sm={7}>
                        <Toggle checked={this.state.admin} onChange={() => this.setState(prevState => ({ admin: !prevState.admin }))} />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col sm={5}>
                        <h5>Ẩn danh</h5>
                    </Col>
                    <Col sm={7}>
                        <Toggle checked={this.state.anon} onChange={() => this.setState(prevState => ({ anon: !prevState.anon }))} />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col sm={5}>
                        <h5>Truy vấn tự động</h5>
                    </Col>
                    <Col sm={7}>
                        <Toggle checked={this.state.autoQuery} onChange={() => this.setState(prevState => ({ autoQuery: !prevState.autoQuery }))} />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col sm={5}>
                        <h5>Nội dung</h5>
                    </Col>
                    <Col sm={7}>
                        <Toggle checked={this.state.content} onChange={() => this.setState(prevState => ({ content: !prevState.content }))} />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col sm={5}>
                        <h5>Xóa</h5>
                    </Col>
                    <Col sm={7}>
                        <Toggle checked={this.state.delete} onChange={() => this.setState(prevState => ({ delete: !prevState.delete }))} />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col sm={5}>
                        <h5>Xuất cục bộ</h5>
                    </Col>
                    <Col sm={7}>
                        <Toggle checked={this.state.exportLocal} onChange={() => this.setState(prevState => ({ exportLocal: !prevState.exportLocal }))} />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col sm={5}>
                        <h5>Xuất từ xa</h5>
                    </Col>
                    <Col sm={7}>
                        <Toggle checked={this.state.exportExtern} onChange={() => this.setState(prevState => ({ exportExtern: !prevState.exportExtern }))} />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col sm={5}>
                        <h5>Truy vấn</h5>
                    </Col>
                    <Col sm={7}>
                        <Toggle checked={this.state.query} onChange={() => this.setState(prevState => ({ query: !prevState.query }))} />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col sm={5}>
                        <h5>Nhập</h5>
                    </Col>
                    <Col sm={7}>
                        <Toggle checked={this.state.import} onChange={() => this.setState(prevState => ({ import: !prevState.import }))} />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col sm={5}>
                        <h5>Sửa</h5>
                    </Col>
                    <Col sm={7}>
                        <Toggle checked={this.state.modify} onChange={() => this.setState(prevState => ({ modify: !prevState.modify }))} />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col sm={5}>
                        <h5>Ghi CD</h5>
                    </Col>
                    <Col sm={7}>
                        <Toggle checked={this.state.cd_burner} onChange={() => this.setState(prevState => ({ cd_burner: !prevState.cd_burner }))} />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col sm={5}>
                        <h5>Định tuyến Dicom</h5>
                    </Col>
                    <Col sm={7}>
                        <Toggle checked={this.state.autorouting} onChange={() => this.setState(prevState => ({ autorouting: !prevState.autorouting }))} />
                    </Col>
                </Row>

                <Row className="mt-3 text-center">
                    <Col>
                        <button type='button' name='create' className='otjs-button otjs-button-blue' onClick={() => { this.props.onSubmitRole(this.state) }}> Xác nhận </button>
                    </Col>
                </Row>

            </Fragment>
        );
    }
}
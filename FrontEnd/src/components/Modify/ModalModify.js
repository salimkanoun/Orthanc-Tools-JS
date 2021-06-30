import React, {Component} from 'react'
import Modal from 'react-bootstrap/Modal'
import {EditableCell} from "../CommonComponents/RessourcesDisplay/ReactTable/ColumnFactories";
import CommonTable from "../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";


function TagTable({data, onDataUpdate}) {
    const columns = [
        {
            accessor: 'TagName',
            Header: 'Tag name',
        }, {
            accessor: 'Value',
            Header: 'Value',
            Cell: EditableCell
        }, {
            accessor: 'Delete',
            Header: 'Delete',
            Cell: ({
                       value: initialValue,
                       row: {values},
                       column: {id, accessor},
                       onDataChange, // This is a custom function that we supplied to our table instance
                   }) => {
                const [value, setValue] = React.useState(initialValue)

                // We need to keep and update the state of the cell normally
                const onChange = e => {
                    setValue(e.target.checked);
                    onDataChange(initialValue, e.target.checked, values, id || accessor);
                }

                // If the initialValue is changed external, sync it up with our state
                React.useEffect(() => {
                    setValue(initialValue)
                }, [initialValue])

                return (!['PatientID', 'SeriesTime', 'SeriesDate', 'Modality', 'StudyDate', 'StudyTime'].includes(values.TagName) ?
                    <input type={'checkbox'} checked={value} onChange={onChange}/> : 'Mandatory')
            }
        }
    ]
    return <CommonTable tableData={data} columns={columns} onDataChange={onDataUpdate}/>
}

export default class ModalModify extends Component {

    render = () => {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide} onClick={(e) => e.stopPropagation()} size='xl'>
                <Modal.Header closeButton>
                    <Modal.Title>Modify {this.props.level}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TagTable data={this.props.data} onDataUpdate={this.props.onDataUpdate}/>
                    <div className='row'>
                        <div className='col-auto'>
                            <label htmlFor='removePrivateTags'>Removing private tags</label>
                        </div>
                        <div className='col-sm'>
                            <input className='form-check-input' type='checkbox'
                                   defaultChecked={this.props.defaultCheckedPrivateTags}
                                   onClick={this.props.onClickPrivateTags}/>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-auto'>
                            <label htmlFor='keepSource'>Keep Source</label>
                        </div>
                        <div className='col-sm'>
                            <input className='form-check-input' type='checkbox'
                                   defaultChecked={this.props.defaultCheckedKeepSource}
                                   onClick={this.props.onClickKeepSource}/>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button type='button' className='btn btn-info' onClick={this.props.onHide}>Cancel</button>
                    <button type='button' className='btn btn-warning' onClick={this.props.modify}>Modify</button>
                </Modal.Footer>
            </Modal>
        )
    }
}

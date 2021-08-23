import React, {useMemo} from 'react'
import Modal from "react-bootstrap/Modal";
import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";

export default function ModalDetails({show, onHide, data}) {

    const columnDetails = useMemo(() => [
        {
            accessor: 'ID',
            show: false
        }, {
            accessor: 'ErrorCode',
            Header: 'Error Code'
        },
        {
            accessor: 'ErrorDescription',
            Header: 'Error Description'
        }, {
            accessor: 'Priority',
            Header: 'Priority'
        }, {
            accessor: 'Type',
            Header: 'Type'
        }, {
            accessor: 'EffectiveRuntime',
            Header: 'Effective Runtime'
        }, {
            accessor: 'Content',
            Header: 'Details',
            Cell: ({row}) => {
                return (
                    <pre>
                        {JSON.stringify(row.values.Content, null, 2)}
                    </pre>
                )
            }
        }
    ], [])

    const row = useMemo(() => data, [data])

    return (
        <Modal show={show} onHide={onHide} size='xl'>
            <Modal.Header closeButton>
                <Modal.Title>Job Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CommonTable
                    tableData={row}
                    columns={columnDetails}
                />
            </Modal.Body>
            <Modal.Footer>
                <button type='button'
                        className='otjs-button otjs-button-blue'
                        onClick={onHide}>
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    );

}
import React, { useMemo, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";

    export default ({ show, onHide, data}) => {

        const row = useMemo(() => data, [data])

        const columns = [

            {
                id: 'ErrorCode',
                accessorKey: 'ErrorCode',
                header: () => <span>ErrorCode</span>,
                cell: row => <i>{row.getValue()}</i>
            },
            {
                id: 'ErrorDescription',
                accessorKey: 'ErrorDescription',
                header: () => <span>ErrorDescription</span>,
                cell: row => <i>{row.getValue()}</i>
            },
            {
                id: 'Priority',
                accessorKey: 'Priority',
                header: () => <span>Priority</span>,
                cell: row => <i>{row.getValue()}</i>
            },
            {
                id: 'Type',
                accessorKey: 'Type' ,
                header: () => <span>Type</span>,
                cell: row => <i>{row.getValue()}</i>
            },
            {
                id: 'EffectiveRuntime',
                accessorKey: 'EffectiveRuntime',
                header: () => <span>EffectiveRuntime</span>,
                cell: row => <i>{row.getValue()}</i>
            },
            {
                id: 'Content',
                accessorKey: 'Content',
                header: () => <span>Details</span>,
                cell:  ({row}) => {
                    return (
                        <pre>
                            {JSON.stringify(row.original.Content, null, 2)}
                        </pre>
                    )
                }
            }
        ]

        return (
            <Modal show={show} onHide={onHide} size='xl'>
                <Modal.Header closeButton>
                    <Modal.Title>Job Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CommonTableV8 columns={columns} data={row}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                            className='otjs-button otjs-button-blue'
                            onClick={onHide}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );

    }
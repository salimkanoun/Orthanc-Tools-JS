import React, { useState } from "react"
import { Modal } from "react-bootstrap";
import TableSeries from "../CommonComponents/RessourcesDisplay/ReactTableV8/TableSeries"
import Metadata from "../Metadata/Metadata";
import ActionButtonSeries from "./ActionButtons/ActionButtonSeries"

export default ({
    series = [],
    onDelete
}) => {
    const [metadataOrthancID, setMetadataOrthancID] = useState(null);

    const additionalColumns = [
        {
            id: 'Action',
            accessorKey: 'Action',
            header: 'Action',
            cell: ({ row }) => {
                return (
                    <ActionButtonSeries
                        orthancID={row.original.SeriesOrthancID}
                        onDelete={onDelete}
                        dataDetails={row.original}
                        onShowMetadata={()=>setMetadataOrthancID(row.original.SeriesOrthancID) }
                    />)
            }
        }]

    return (
        <>
            <Modal show={metadataOrthancID !=null } onHide={() => setMetadataOrthancID(null)} scrollable={true} >
                <Modal.Header closeButton>
                    <Modal.Title>Metadata</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Metadata seriesOrthancId={metadataOrthancID} />
                </Modal.Body>
            </Modal>
            <TableSeries series={series} additionalColumns={additionalColumns} />
        </>
    )
}
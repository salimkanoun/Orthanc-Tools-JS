import React, { useState } from "react"
import { Modal } from "react-bootstrap";

import TableSeries from "../CommonComponents/RessourcesDisplay/ReactTableV8/TableSeries"
import Metadata from "../Metadata/Metadata";
import ActionButtonSeries from "./ActionButtons/ActionButtonSeries"
import Modify from '../Modify/Modify'
import ConstantLevel from "../Modify/ConstantLevel";
import apis from "../../services/apis";
import { errorMessage } from "../../tools/toastify";
import SeriesPreview from "./Preview/SeriesPreview";

export default ({
    series = [],
    onDelete
}) => {
    const [metadataOrthancID, setMetadataOrthancID] = useState(null);
    const [modifyOrthancID, setModifyOrthancID] = useState(null)
    const [showPreviewID, setShowPreviewID] = useState(null)

    const handleDownloadNifti = (seriesOrthancId, compressed) => {
        apis.exportDicom.exportToNifti(seriesOrthancId, compressed).catch(() => errorMessage('Uncreatable Nifti'))
    }

    const additionalColumns = [
        {
            id: 'Action',
            accessorKey: 'Action',
            header: 'Action',
            cell: ({ row }) => {
                const SeriesOrthancID = row.original.SeriesOrthancID
                return (
                    <ActionButtonSeries
                        orthancID={SeriesOrthancID}
                        onDelete={() => onDelete(SeriesOrthancID)}
                        dataDetails={row.original}
                        onShowMetadata={() => setMetadataOrthancID(SeriesOrthancID)}
                        onShowModify={() => setModifyOrthancID(SeriesOrthancID)}
                        onDownloadNifti={(compressed) => handleDownloadNifti(SeriesOrthancID, compressed)}
                        onShowPreview={() => setShowPreviewID(SeriesOrthancID)}
                    />)
            }
        }]

    return (
        <>
            <Modal show={metadataOrthancID != null} onHide={() => setMetadataOrthancID(null)} scrollable={true} >
                <Modal.Header closeButton>
                    <Modal.Title>Metadata</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Metadata seriesOrthancId={metadataOrthancID} />
                </Modal.Body>
            </Modal>

            <Modal show={modifyOrthancID != null} onHide={() => setModifyOrthancID(null)} onClick={(e) => e.stopPropagation()} size='xl'>
                <Modal.Header closeButton>
                    <Modal.Title> Modify Series</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Modify orthancID={modifyOrthancID} level={ConstantLevel.SERIES} onClose={() => setModifyOrthancID(null)}/>
                </Modal.Body>
            </Modal>

            <Modal show={showPreviewID != null} onHide={() => setShowPreviewID(null)} onClick={(e) => e.stopPropagation()} size='xl'>
                <Modal.Header closeButton>
                    <Modal.Title> Preview Series </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SeriesPreview orthancSeriesID={showPreviewID} onClose={() => setShowPreviewID(null)}/>
                </Modal.Body>
            </Modal>
            <TableSeries series={series} additionalColumns={additionalColumns} />
        </>
    )
}
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'

import TableSeries from '../CommonComponents/RessourcesDisplay/ReactTableV8/TableSeries'
import ActionButtonSeries from './ActionButtons/ActionButtonSeries'
import Metadata from '../Metadata/Metadata'
import apis from '../../services/apis'
import { errorMessage } from '../../tools/toastify'

export default ({ series = [] }) => {

    const [metadataOrthancID, setMetadataOrthancID] = useState(null)

    const handleDownloadNifti = (seriesOrthancId, compressed) => {
        apis.exportDicom.exportToNifti(seriesOrthancId, compressed).catch(() => errorMessage('Uncreatable Nifti'))
    }

    const additionalColumns = [
        {
            id: 'Action',
            accessorKey: 'Action',
            header: 'Action',
            cell: ({ row }) => {
                const seriesOrthancID = row.original.SeriesOrthancID
                return (
                    <ActionButtonSeries
                        orthancID={seriesOrthancID}
                        onDelete={() => { }}
                        dataDetails={row.original}
                        onShowMetadata={() => setMetadataOrthancID(seriesOrthancID)}
                        onShowModify={() => { }}
                        onDownloadNifti={(compressed)=> handleDownloadNifti(seriesOrthancID, compressed)}
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
            <TableSeries series={series} additionalColumns={additionalColumns} />
        </>
    )
}
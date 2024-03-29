import React from 'react'
import { Button, Dropdown } from 'react-bootstrap'

export default ({
    onDelete,
    onShowMetadata,
    onShowModify,
    onDownloadNifti,
    onShowPreview
}) => {


    return (
        <Dropdown drop='left' className="text-center">
            <Dropdown.Toggle variant="button-dropdown-green" className="button-dropdown button-dropdown-green">
                Action
            </Dropdown.Toggle>

            <Dropdown.Menu className="mt-2 border border-dark border-2">
                <Button className='dropdown-item bg-green' onClick={() => onShowPreview()}>
                    Preview Series
                </Button>
                <Button className='dropdown-item bg-green' onClick={() => onShowMetadata()}>
                    View Metadata
                </Button>
                <Button className='dropdown-item bg-green' onClick={() => onDownloadNifti(false)}>
                    Download nii
                </Button>
                <Button className='dropdown-item bg-green' onClick={() => onDownloadNifti(true)}>
                    Download nii.gz
                </Button>
                <Button className='dropdown-item bg-orange' onClick={() => onShowModify()}>
                    Modify
                </Button>

                <Button className='dropdown-item bg-red'
                    onClick={onDelete}>Delete
                </Button>
            </Dropdown.Menu>
        </Dropdown>
    )
}
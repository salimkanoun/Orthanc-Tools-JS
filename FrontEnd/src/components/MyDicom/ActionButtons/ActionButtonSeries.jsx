import React from 'react'
import { Button, Dropdown } from 'react-bootstrap'

export default ({
    onShowMetadata,
    onDownloadNifti
}) => {

    return (
        <Dropdown drop='left' className="text-center">
            <Dropdown.Toggle variant="button-dropdown-green" className="button-dropdown button-dropdown-green">
                Action
            </Dropdown.Toggle>

            <Dropdown.Menu className="mt-2 border border-dark border-2">
                <Button className='dropdown-item bg-green' onClick={() => onShowMetadata()}>
                    View Metadata
                </Button>

                <Button className='dropdown-item bg-green' onClick={() => onDownloadNifti(false)}>
                    Download nii
                </Button>
                <Button className='dropdown-item bg-green' onClick={() => onDownloadNifti(true)}>
                    Download nii.gz
                </Button>
            </Dropdown.Menu>
        </Dropdown>
    )
}
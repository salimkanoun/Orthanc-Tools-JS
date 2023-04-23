import React, { useState } from 'react'
import Dropzone from 'react-dropzone'

export default ({ onDrop, message, fileTypes = [], multiple }) => {

    const TYPE_JSON = 'json'
    const TYPE_PDF = 'pdf'
    const TYPE_CSV = 'csv'
    const TYPE_IMAGE = 'image'

    const [isDragging, setIsDragging] = useState(false)

    const getMimeType = (fileType) => {
        switch (fileType.toLowerCase()) {
            case TYPE_JSON:
                return {
                    'application/json': ['.json']
                }
            case TYPE_PDF:
                return {
                    'application/pdf': ['.pdf']
                }
            case TYPE_CSV:
                return {
                    'text/csv': ['.csv'],
                    'text/plain': ['.csv'],
                    'application/vnd.ms-excel': ['.csv']
                }
            case TYPE_IMAGE:
                return {
                    "image/*": [".jpeg", ".png"]
                }
            default:
                console.error('Unknown Extension to set Mime type for dropzone')
        }
    }

    const getAccept = () => {
        let accept = {}
        fileTypes.forEach((type) => {
            let object = getMimeType(type)
            accept = {
                ...accept,
                ...object
            }
        })

        return accept
    }

    return (
        <Dropzone
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop} accept={getAccept()}
            multiple={multiple}>
            {({ getRootProps, getInputProps }) => (
                <section>
                    <div className={isDragging ? "dropzone dz-parsing" : "dropzone"} {...getRootProps()} >
                        <input {...getInputProps()} />
                        <p>{message}</p>
                    </div>
                </section>
            )}
        </Dropzone>
    )
}
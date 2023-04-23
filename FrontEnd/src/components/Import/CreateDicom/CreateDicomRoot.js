import React, { useMemo, useState } from 'react'
import Dropzone from 'react-dropzone'
import { Button } from 'react-bootstrap'
import Select from 'react-select/creatable'

import TagTable from './TagTable'

import { errorMessage, successMessage } from '../../../tools/toastify'
import apis from '../../../services/apis'

export default () => {

    const REQUIRED_TAGS = ['PatientID', 'PatientName', 'SeriesDescription', 'StudyDescription']

    const [isDragging, setIsDragging] = useState(false)
    const [tags, setTags] = useState([])
    const [files, setFiles] = useState([])
    const [uploadState, setUploadState] = useState('Selected')

    const tagOptions = useMemo(() => {
        return REQUIRED_TAGS.map(tag => ({ label: tag, value: tag }))
    }, [])

    const checkDicomTags = () => {
        for (let tag of tags) {
            if (REQUIRED_TAGS.includes(tag.TagName) && (!tag.Value || tag.Value.length < 1)) {
                return false
            }
        }
        return true;
    }

    const getTags = () => {
        let newtags = {};
        tags.forEach(tag => {
            newtags[tag.TagName] = tag.Value;
        })
        return newtags;
    }

    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            var fr = new FileReader()
            fr.readAsDataURL(file)
            fr.onload = () => {
                resolve(fr.result)
            }
        })
    }

    const createDicom = async () => {
        if (!checkDicomTags()) {
            errorMessage(tags.TagName + ' should be filled');
            return;
        }

        if (files.length < 1) {
            errorMessage('No files selected');
            return;
        }

        const images = await Promise.all(files.map(file => readFileAsDataURL(file)));

        try {
            setUploadState("Uploading")
            await apis.importDicom.createDicom(images, null, getTags());
            setUploadState("Uploaded")
            successMessage(`Dicoms successfully created`)
        } catch (error) {
            setUploadState('Failed To Upload')
            errorMessage(error?.data?.errorMessage ?? 'Dicoms creation failed')
        }
    }

    const handleDrop = (files) => {
        setFiles(files)
        setUploadState('Selected')
    }

    const handleDataChange = (TagName, columnId, value) => {
        let newTags = [...tags];
        newTags.forEach(tag => {
            if(tag.TagName === TagName){
                tag.Value = value
            }
        });

        setTags(newTags)
    }

    const handleNewTag = (tagName) => {
        let newTags = [...tags];
        newTags.push({
            'TagName': tagName,
            Value: '',
        })
        setTags(newTags)
    }

    const handleDeleteTag = (tagName) => {
        let currentTags = [...tags];
        let newTags = currentTags.filter((tag) => tag.TagName !== tagName)
        setTags(newTags)
    }

    return (
        <div>
            <Dropzone accept={"application/pdf, image/jpeg, image/png"}
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop} multiple>
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div
                            className={(isDragging || !!files.length) ? "dropzone dz-parsing" : "dropzone"} {...getRootProps()} >
                            <input {...getInputProps()} />
                            <div className={"d-flex flex-column justify-content-center align-items-center h-100"}>
                                <p style={{ "line-height": "normal" }}>{files.length ? `${uploadState} ${files.length > 1 ? files.length + ' files' : 'one file'} ` : "Drop png, jpeg or pdf"}</p>
                            </div>
                        </div>
                    </section>
                )}
            </Dropzone>
            <TagTable data={tags} onDataUpdate={handleDataChange} onDeleteTag={(tagName) => handleDeleteTag(tagName)} />
            <div>
                New Tag :
                <Select options={tagOptions} onChange={(option) => handleNewTag(option.value)} />
            </div>
            <div className='d-flex justify-content-end'>
                <Button type="submit" onClick={createDicom}
                    disabled={files.length < 1}
                >
                    Create DICOM
                </Button>
            </div>
        </div>
    )
}
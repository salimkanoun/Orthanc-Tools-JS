import React, { useMemo, useState } from 'react'
import { Button } from 'react-bootstrap'
import Select from 'react-select/creatable'

import MyDropzone from '../../CommonComponents/MyDropzone'
import TagTable from './TagTable'

import { errorMessage, successMessage } from '../../../tools/toastify'
import apis from '../../../services/apis'

export default ({ parentStudy = null, onCreatedDicom = ()=>{} }) => {

    const REQUIRED_TAGS = parentStudy == null ? ['PatientID', 'PatientName', 'SeriesDescription', 'StudyDescription'] : ['SeriesDescription']

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
        return new Promise((resolve) => {
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
            await apis.importDicom.createDicom(images, parentStudy, getTags());
            setUploadState("Uploaded")
            successMessage(`Dicoms successfully created`)
            onCreatedDicom()
        } catch (error) {
            setUploadState('Failed To Upload')
            errorMessage(error?.data?.errorMessage ?? 'Dicoms creation failed')
        }
    }

    const handleDrop = (files) => {
        setFiles((file) => [...file, ...files])
        setUploadState('Selected')
    }

    const handleDataChange = (TagName, columnId, value) => {
        let newTags = [...tags];
        newTags.forEach(tag => {
            if (tag.TagName === TagName) {
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
            <MyDropzone fileTypes={["pdf", "jpeg", "image"]}
                onDrop={handleDrop}
                message={files.length ? `${uploadState} ${files.length > 1 ? files.length + ' files' : 'one file'} ` : "Drop png, jpeg or pdf"}
                multiple
            />
            <TagTable data={tags} onDataUpdate={handleDataChange} onDeleteTag={(tagName) => handleDeleteTag(tagName)} />
            <div>
                New Tag :
                <Select menuShouldScrollIntoView options={tagOptions} onChange={(option) => handleNewTag(option.value)} />
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
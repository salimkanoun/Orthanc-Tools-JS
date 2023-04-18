import React, { useState } from 'react'
import Dropzone from 'react-dropzone'

import { InputGroup, Button } from "react-bootstrap";

import TagTable from "../CommonComponents/RessourcesDisplay/ReactTable/TagTable2";
import { ModalPicEditor } from "../CreateDicom/ModalPicEditor";

import { errorMessage, successMessage } from '../../tools/toastify';
import apis from '../../services/apis'

const REQUIRED_TAGS = ['PatientID', 'PatientName', 'SeriesDescription', 'StudyDescription']

export default () => {

    const [isDragging, setIsDragging] = useState(false)
    const [tags, setTags] = useState([])
    const [newTag, setNewTag] = useState('')
    const [files, setFiles] = useState([])
    const [uploadState, setUploadState] = useState('Selected')
    const [showEditor, setShowEditor] = useState(false)

    const dragListener = (dragStarted) => {
        setIsDragging(dragStarted)
    }

    const getTags = () => {
        let newtags = {};
        tags.forEach(tag => {
            if (tag.Value !== '[auto]' && !tag.Value.startsWith("[inherited]")) {
                tags[tag.TagName] = tag.Value;
            }
        })
        return newtags;
    }

    const checkDicomTags = () => {
        for (let tag of tags) {
            if (REQUIRED_TAGS.includes(tag.TagName) && (!tag.Value || tag.Value.length < 1)) {
                return false
            }
        }
        return true;
    }

    const getUniformImages = async () => {
        const images = await Promise.all(files.map(file => createImageBitmap(file)));
        let targetWidth = Math.max(...images.map(img => img.width));
        let targetHeight = Math.max(...images.map(img => img.height));
        return images.map(img => _resizeImage(img, targetWidth, targetHeight));
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

        const images = await getUniformImages();

        try {
            setUploadState("Uploading")
            let response = await apis.importDicom.createDicom(images[0], this.props.OrthancID, getTags());
            await Promise.all(images.slice(1)
                .map(image => apis.importDicom.createDicom(image, response.ParentSeries, {})));
            setUploadState("Uploaded")
            successMessage(`Dicoms successfully created (Series : ${response.ParentSeries})`)
        } catch (error) {
            setUploadState('Failed To Upload')
            errorMessage('Dicoms creation failed')
            error.log(error);
        }
    }

    const _resizeImage = (image, targetWidth, targetHeight) => {
        const canvas = document.createElement('canvas');
        const canvasContext = canvas.getContext('2d');
        canvas.height = targetHeight;
        canvas.width = targetWidth;

        canvasContext.fillStyle = 'black';
        canvasContext.fillRect(0, 0, targetWidth, targetHeight)
        canvasContext.drawImage(image, (targetWidth - image.width) / 2, (targetHeight - image.height) / 2, image.width, image.height)
        return canvas.toDataURL()
    }

    const handleDrop = async (files) => {
        setFiles(files)
        setUploadState('Selected')
    }

    const handleDataChange = (oldValue, newValue, row, column) => {
        let newTags = [...tags];
        if (column === 'Value') {
            newTags.find(x => x.TagName === row.TagName)[column] = newValue;
        } else {
            newTags = newTags.filter(x => x.TagName !== row.TagName);
        }
        setTags(newTags)
    }

    const handleNewTagChange = (e) => {
        setNewTag(e.target.value)
    }

    const handleNewTag = (e) => {
        let newTags = [...tags];
        newTags.push({
            'TagName': newTag,
            Value: '',
        })
        setTags(newTags)
        setNewTag('')
    }

    const handleHide = () => {
        setShowEditor(false)
    }

    const handleEditorSave = (blob, idx) => {
        let newfiles = [...files];
        newfiles[idx] = blob
        setFiles(newfiles)
    }

    return (
        <div>
            <Dropzone accept={"application/pdf, image/jpeg, image/png"}
                onDragEnter={() => dragListener(true)}
                onDragLeave={() => dragListener(false)}
                onDrop={handleDrop} multiple>
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div
                            className={(isDragging || !!files.length) ? "dropzone dz-parsing" : "dropzone"} {...getRootProps()} >
                            <input {...getInputProps()} />
                            <div className={"d-flex flex-column justify-content-center align-items-center h-100"}>
                                <p style={{ "line-height": "normal" }}>{files.length ? `${uploadState} ${files.length > 1 ? files.length + ' files' : 'one file'} ` : "Drop png, jpeg or pdf"}</p>

                                {files.length ? <Button onClick={(e) => {
                                    setShowEditor(false)
                                    e.stopPropagation()
                                }}>{"Open Editor"}</Button> : null}
                            </div>
                        </div>
                    </section>
                )}
            </Dropzone>
            <ModalPicEditor files={showEditor ? files : null} onHide={handleHide}
                onSave={handleEditorSave} />
            <TagTable data={tags} onDataUpdate={handleDataChange} />
            <div className={"w-100 d-flex justify-content-between otjs-button"}>
                <InputGroup>
                    <InputGroup.Text>{"Add Tag"}</InputGroup.Text>
                    <input onChange={handleNewTagChange} value={newTag} />
                    <Button type={"submit"} onClick={handleNewTag}>{'+'}</Button>
                </InputGroup>
                <Button type={"submit"} onClick={createDicom}
                    disabled={files.length < 1}>{'Create DICOM'}</Button>
            </div>
        </div>
    )
}
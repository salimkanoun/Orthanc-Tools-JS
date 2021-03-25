import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import apis from '../../services/apis'

export default class CreateDicom extends Component {

    state = {
        isDragging: false
    }

    dragListener = (dragStarted) => {
        this.setState({ isDragging: dragStarted })
    }

    createDicom = async (file) => {

        if(file.length > 1) return

        await this.__pFileReader(file[0]).then(async (content) => {
            try {
                let response = await apis.importDicom.createDicom( content.result, 'studyOrthancID', {})
                console.log(response)

            } catch (error) {
                console.log(error)
            }

        })
        
    }

    __pFileReader = (file) => {
        return new Promise((resolve, reject) => {
            var fr = new FileReader()
            fr.readAsDataURL(file)
            fr.onload = () => {
                resolve(fr)
            }
        })
    }

    render = () => {
        return (
            <div className="jumbotron">
                <Dropzone onDragEnter={() => this.dragListener(true)} onDragLeave={() => this.dragListener(false)} onDrop={this.createDicom} >
                    {({ getRootProps, getInputProps }) => (
                        <section>
                            <div className={(this.state.isDragging || this.state.inProgress) ? "dropzone dz-parsing" : "dropzone"} {...getRootProps()} >
                                <input directory="" webkitdirectory="" {...getInputProps()} />
                                <p>{this.state.inProgress ? "Uploading" : "Drop Dicom Folder"}</p>
                            </div>
                        </section>
                    )}
                </Dropzone>
            </div>
        )
    }

}
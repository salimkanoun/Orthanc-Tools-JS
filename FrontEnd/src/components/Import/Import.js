import React, { Component, Fragment } from 'react'
import Uppy from '@uppy/core'
import StatusBar from '@uppy/status-bar'
import XHRUpload from '@uppy/xhr-upload'
import { DragDrop } from '@uppy/react'

//Ce composant sera a connecter au redux pour connaitre la longueur de la liste d'export
export default class Import extends Component {

    constructor(props){
        super(props)
        this.uppy = Uppy({
            autoProceed: true
        })

        this.uppy.use(XHRUpload, {
            endpoint: '/api/instances',
            formData : false,
            headers: {
                'Content-Type' : 'application/dicom',
                'Accept': 'application/json'
            }
          })

        this.uppy.use(StatusBar, {
            id : 'statusBar',
            target: 'body',
            hideUploadButton: false,
            showProgressDetails: true,
            hideAfterFinish: false
          })
        
        this.uppy.on('file-added', (file) => {
            console.log('Added file', file)
          })

        this.uppy.on('upload-success', (file, response) => {
            console.log(response.status)
            console.log(response.body)
            // do something with file and response
          })
    }

    componentWillUnmount () {
        this.uppy.close()
    }



    state = {
        
    }

    render(){
        return (
            <Fragment>
                 <DragDrop
                    uppy={this.uppy}
                    locale={{
                    strings: {
                        // Text to show on the droppable area.
                        // `%{browse}` is replaced with a link that opens the system file selection dialog.
                        dropHereOr: 'Drop here or %{browse}',
                        // Used as the label for the link that opens the system file selection dialog.
                        browse: 'browse'
                    }
                    }}
                />
            </Fragment>

        )
    }
}
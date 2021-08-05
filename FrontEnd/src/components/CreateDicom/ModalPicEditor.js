import React, {Component, createRef} from "react";
import 'tui-image-editor/dist/tui-image-editor.css';
import ImageEditor from '@toast-ui/react-image-editor';
import Modal from "react-bootstrap/Modal";
import {Button} from "react-bootstrap";

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    let byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    let ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    let ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    let blob = new Blob([ab], {type: mimeString});
    return blob;

}

const myTheme = {
    // Theme object to extends default dark theme.
};

export class ModalPicEditor extends Component {
    state = {
        fileIdx: 0
    }

    constructor(props) {
        super(props);
        this.editor = createRef();

    }

    render() {

        return (
            <Modal fullscreen={'xl'}
                   show={!!this.props.files && this.props.files.length}
                   onHide={this.props.onHide}
                   onClick={(e) => e.stopPropagation()} size={'xxl'} contentClassName={"w-100"}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Dicom</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {(!!this.props.files && this.props.files.length ?
                        <div className={"row"}>
                            <div className={"col-2"}>
                                <ul className="list-group">
                                    {this.props.files.map((file, fileIdx) => (
                                        <Button className={"list-group-item"} variant={"outline-primary"}
                                                onClick={() => {
                                                    this.editor.current.getInstance().loadImageFromURL(URL.createObjectURL(file), file.name)
                                                    this.setState({
                                                        fileIdx
                                                    })
                                                }
                                                }>{file.name}</Button>
                                    ))}
                                </ul>
                            </div>

                            <div className={"col-10"}>
                                <h2>{this.props.files[this.state.fileIdx].name}</h2>
                                <ImageEditor
                                    ref={this.editor}
                                    includeUI={{
                                        loadImage: {
                                            path: URL.createObjectURL(this.props.files[this.state.fileIdx]),
                                            name: this.props.files[this.state.fileIdx].name,
                                        },
                                        theme: myTheme,
                                        menu: ['crop', 'resize', 'shape', 'filter'],
                                        initMenu: 'filter',
                                        uiSize: {
                                            width: '1300px',
                                            height: '800px',
                                        },
                                        menuBarPosition: 'bottom',
                                    }}
                                    cssMaxHeight={800}
                                    cssMaxWidth={1300}
                                    selectionStyle={{
                                        cornerSize: 20,
                                        rotatingPointOffset: 70,
                                    }}
                                    usageStatistics={true}
                                />
                                <div className={'d-flex justify-content-end w-100'}>
                                    <Button variant={"info"} onClick={() => {
                                        if (!(this.props.onSave instanceof Function)) return;
                                        let blob = dataURItoBlob(this.editor.current.getInstance().toDataURL());
                                        blob.name = this.props.files[this.state.fileIdx].name
                                        this.props.onSave(blob, this.state.fileIdx)
                                    }}>Save</Button>
                                </div>
                            </div>
                        </div> : null)}
                </Modal.Body>
            </Modal>)
    }
}
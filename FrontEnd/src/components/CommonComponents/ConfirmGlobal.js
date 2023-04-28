import React, { useRef, useState } from "react"
import { Button, Modal } from "react-bootstrap"

const confirmAction = {
    current: () => Promise.resolve(true)
}

export function confirm(props) {
    return confirmAction.current(props)
}

export default () => {
    const [open, setOpen] = useState(false)
    const [props, setProps] = useState({})
    const resolveRef = useRef(() => { })
    confirmAction.current = (props) => new Promise(resolve => {
        setProps(props)
        setOpen(true)
        resolveRef.current = resolve
    })
    return (
        <Modal show={open} onHide={() => setOpen(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.message}
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn btn-info' onClick={() => { resolveRef.current(false); setOpen(false) }}>Cancel</Button>
                <Button className='btn btn-danger' onClick={() => { resolveRef.current(true); setOpen(false) }}>Confirm</Button>
            </Modal.Footer>
        </Modal>
    )
}
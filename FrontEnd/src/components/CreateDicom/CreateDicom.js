import React, { Component, Fragment, useState } from 'react'
import { Button } from 'react-bootstrap';
import ModalCreateDicom from "./ModalCreateDicom";


export default ({ orthancID, level }) => {

    const [show, setShow] = useState(false)

    const toogleOpen = () => {
        setShow(!show)
    }

    return (
        <Fragment>
            <Button className='dropdown-item bg-primary' type='button'
                onClick={toogleOpen}>Create Dicom
            </Button>
            <ModalCreateDicom
                show={show}
                onHide={() => setShow(false)}
                //modify={() => modify()}
                OrthancID={orthancID}
                level={level}
            />
        </Fragment>
    )

}
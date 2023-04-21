import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Dropdown, FormControl, InputGroup } from "react-bootstrap";

import apis from "../../../services/apis";

export default ({ studiesProps }) => {

    const [labels, setLabels] = useState([])
    const [createLabel, setCreateLabel] = useState('')
    const [studies, setStudies] = useState({})
    const [search, setSearch] = useState('')

    useEffect(() => {
        apis.label.getAllLabels().then(labelsLocal => {
            setLabels(labelsLocal.map(label => label.label_name))
        })
    }, [])

    const handleCreateInput = (event) => {
        setCreateLabel(event.target.value)
    }

    const handleSearchInput = (event) => {
        setSearch(event.target.value)
    }


    const handleOpenClick = () => {
        return _refreshStudyLabel();
    }

    const _refreshStudyLabel = async () => {
        let studies_tab = await studiesProps
        let studiesLocal = {}
        await Promise.all(studies_tab.map(study => apis.studylabel.getStudyLabels(study.MainDicomTags.StudyInstanceUID)
            .then(labels => {
                studiesLocal[study.MainDicomTags.StudyInstanceUID + ':' + study.PatientMainDicomTags.PatientID + ':' + study.ID + ':' + study.ParentPatient] = labels.map(label => label.label_name);
            })))
        setStudies(studiesLocal)
    }

    const handleSetLabel = (label) => {
        return async () => {
            let count = _containCount(label);
            let v = Object.entries(studies).length;
            let studies = studies;
            if (count !== v) {
                await Promise.all(Object.entries(studies)
                    .map(([study, labels]) => apis.studylabel.createStudyLabel(study.split(':')[0], label, study.split(':')[1], study.split(':')[2], study.split(':')[3])
                        .then(() => {
                            studies[study].push(label);
                            setStudies(studies)
                        }).catch(err => {
                            if (err.status !== 409) throw err;
                        })));
            } else {
                await Promise.all(Object.entries(studies)
                    .map(([study, labels]) => apis.studylabel.deleteStudyLabel(study.split(':')[0], label).then(() => {
                        studies[study] = studies[study].filter(l => label !== l);
                        setStudies(studies)
                    })));
            }
        }
    }

    const getLabelComponent = (label) => {
        let count = _containCount(label);

        let symbol = count;
        if (count === 0) {
            symbol = ' ';
        } else if (count === Object.entries(studies).length) {
            symbol = '✓' + (count !== 1 ? count : '');
        }

        return <Dropdown.ItemText key={label} className={"dropdown-item label-dropdown-item"}>
            <Button className={'btn w-100 text-left d-flex justify-content-between'}
                onClick={handleSetLabel(label)}>
                <p>{`• ${label}`}</p>
                <p className={'text-light-grey'}>{symbol}</p>
            </Button>
        </Dropdown.ItemText>
    }

    const _containCount = (label) => {
        let count = 0;
        Object.entries(studies).forEach(entry => {
            if (entry[1].includes(label)) {
                count++;
            }
        });
        return count;
    }



    let filteredLabels = labels.filter(label => label.includes(search))
    return (
        <>
            <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle variant="button-dropdown-blue"
                    className="mb-4 button-dropdown button-dropdown-blue"
                    id="dropdown-custom-1">Label</Dropdown.Toggle>
                <Dropdown.Menu className="mt-2 border border-dark border-2">
                    <Dropdown.ItemText className='label-dropdown-item'>
                        <InputGroup>
                            <InputGroup.Text>{'Search'}</InputGroup.Text>
                            <FormControl
                                placeholder="filter"
                                aria-label="search"
                                onChange={handleSearchInput}
                            />
                            <InputGroup.Text>{filteredLabels.length}</InputGroup.Text>
                        </InputGroup>
                    </Dropdown.ItemText>
                    {filteredLabels.map(getLabelComponent)}
                </Dropdown.Menu>
            </Dropdown>
        </>
    )
}
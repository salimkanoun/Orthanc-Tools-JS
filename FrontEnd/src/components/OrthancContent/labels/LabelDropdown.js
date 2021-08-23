import React, {Component} from "react";
import {ButtonGroup, Dropdown, FormControl, InputGroup} from "react-bootstrap";
import apis from "../../../services/apis";

export default class LabelDropdown extends Component {

    state = {
        labels: [],
        createLabel: '',
        studies: {},
        search: ''
    }

    componentDidMount() {
        apis.label.getAllLabels().then(labels => {
            this.setState({labels: labels.map(label => label.label_name)});
        });
    }

    handleCreateInput = (event) => {
        this.setState({
            createLabel: event.target.value
        })
    }

    handleSearchInput = (event) => {
        this.setState({
            search: event.target.value
        })
    }


    handleOpenClick = () => {
        return this._refreshStudyLabel();
    }

    async _refreshStudyLabel() {
        let studies_tab = await this.props.studies
        let studies = {}
        await Promise.all(studies_tab.map(study => apis.studylabel.getStudyLabels(study.MainDicomTags.StudyInstanceUID)
            .then(labels => {
                studies[study.MainDicomTags.StudyInstanceUID + ':' + study.PatientMainDicomTags.PatientID + ':' + study.ID + ':' + study.ParentPatient] = labels.map(label => label.label_name);
            })))
        this.setState({studies});
    }

    handleSetLabel(label) {
        return async () => {
            let count = this._containCount(label);
            let v = Object.entries(this.state.studies).length;
            let studies = this.state.studies;
            if (count !== v) {
                await Promise.all(Object.entries(this.state.studies)
                    .map(([study, labels]) => apis.studylabel.createStudyLabel(study.split(':')[0], label, study.split(':')[1], study.split(':')[2], study.split(':')[3])
                        .then(() => {
                            studies[study].push(label);
                            this.setState({studies});
                        }).catch(err => {
                            if (err.status !== 409) throw err;
                        })));
            } else {
                await Promise.all(Object.entries(this.state.studies)
                    .map(([study, labels]) => apis.studylabel.deleteStudyLabel(study.split(':')[0], label).then(() => {
                        studies[study] = studies[study].filter(l => label !== l);
                        this.setState({studies});
                    })));
            }
        }
    }

    getLabelComponent = (label) => {
        let count = this._containCount(label);

        let symbol = count;
        if (count === 0) {
            symbol = ' ';
        } else if (count === Object.entries(this.state.studies).length) {
            symbol = '✓' + (count !== 1 ? count : '');
        }

        return <Dropdown.ItemText key={label} className={"dropdown-item label-dropdown-item"}>
            <button className={'btn w-100 text-left d-flex justify-content-between'}
                    onClick={this.handleSetLabel(label)}>
                <p>{`• ${label}`}</p>
                <p className={'text-light-grey'}>{symbol}</p>
            </button>
        </Dropdown.ItemText>
    }

    _containCount(label) {
        let count = 0;
        Object.entries(this.state.studies).forEach(entry => {
            if (entry[1].includes(label)) {
                count++;
            }
        });
        return count;
    }


    render() {
        let filteredLabels = this.state.labels.filter(label => label.includes(this.state.search))
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
                                    onChange={this.handleSearchInput}
                                />
                                <InputGroup.Text>{filteredLabels.length}</InputGroup.Text>
                            </InputGroup>
                        </Dropdown.ItemText>
                        {filteredLabels.map(this.getLabelComponent)}
                    </Dropdown.Menu>
                </Dropdown>

            </>
        )
    }
}
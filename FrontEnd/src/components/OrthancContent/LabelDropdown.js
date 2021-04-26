import React, {Component} from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import apis from "../../services/apis";
import {Dropdown, FormControl, InputGroup} from "react-bootstrap";

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

    handleCreateSubmit = () => {
        if (this.state.createLabel.length < 1) return;
        let labels = this.state.labels;
        labels.push(this.state.createLabel);
        return apis.label.createLabels(this.state.createLabel).then(() => {
            let fn = this.handleSetLabel(this.state.createLabel);
            this.setState({
                labels,
                createLabel: ''
            });
            return fn();
        }).then(() => this._refreshStudyLabel());
    }

    handleOpenClick = () => {
        return this._refreshStudyLabel();
    }

    async _refreshStudyLabel() {
        let studies = {}
        await Promise.all(this.props.selectedStudiesGetter().map(study => apis.studylabel.getStudyLabels(study.ID)
            .then(labels => {
                studies[study.ID] = labels.map(label => label.label_name);
            })))
        this.setState({studies});
    }

    handleSetLabel(label) {
        return async () => {
            let count = this._containCount(label);
            let v = Object.entries(this.state.studies).length;
            if (count !== v) {
                await Promise.all(Object.entries(this.state.studies)
                    .map(([study, labels]) => apis.studylabel.createStudyLabel(study, label).catch(err => {
                        if (err.status !== 409) throw err;
                    })));
            } else {
                await Promise.all(Object.entries(this.state.studies)
                    .map(([study, labels]) => apis.studylabel.deleteStudyLabel(study, label)));
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

        return <Dropdown.ItemText className={"dropdown-item label-dropdown-item"}>
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
            <DropdownButton title="Labels" onClick={this.handleOpenClick} className={''}>
                <Dropdown.ItemText className={'label-dropdown-item'}>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>{'Search'}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="filter"
                            aria-label="search"
                            onChange={this.handleSearchInput}
                        />
                        <InputGroup.Append>
                            <InputGroup.Text>{filteredLabels.length}</InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                </Dropdown.ItemText>
                {filteredLabels.map(this.getLabelComponent)}
            </DropdownButton>)
    }
}
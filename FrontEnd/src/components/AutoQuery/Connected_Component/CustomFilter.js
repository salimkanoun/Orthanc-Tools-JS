import React, {Component, Fragment} from 'react'
import Select from 'react-select'

import {saveFilters} from '../../../actions/TableResult'
import {connect} from 'react-redux'

class CustomFilter extends Component {

    state = {
        reverse: false,
        lastValues: []
    }

    customStyles = {
        option: (provided, state) => ({
            ...provided,
            color: this.state.reverse ? 'red' : 'blue'
        })
    }


    componentDidMount = () => {
        this.props.onFilter(this.props.filters[this.props.ID])
    }

    filter = (reverse, options) => {
        let values = []
        options ? options.forEach(element => values.push(element.value)) : values = this.state.lastValues
        this.setState({
            lastValues: values
        })
        if (reverse) {
            let answer = []
            this.props.options.forEach(element => {
                if (!values.includes(element.value)) answer.push(element.value)
            })
            if (answer.length === 0) answer = ['']
            values = answer
        }
        this.props.onFilter(values)
        this.props.saveFilters(this.props.ID, values)
        this.props.saveValues() //save filtered values into the redux 
    }

    handleClick = (e) => {
        e.stopPropagation()
        this.setState({
            reverse: !this.state.reverse
        })
        this.filter(!this.state.reverse)
    }

    getDefaultValues = () => {
        let options = this.props.filters[this.props.ID]
        let defaultValue = []
        options ? options.forEach(element => defaultValue.push({value: element, label: element})) : defaultValue = []
        return defaultValue
    }


    render = () => {

        return (
            <Fragment>
                <Select isMulti options={this.props.options} defaultValue={this.getDefaultValues()}
                        onChange={(values) => this.filter(this.state.reverse, values ? values : [])}
                        styles={this.customStyles} menuPosition={'fixed'}/>
                <input type="button" className="otjs-button otjs-button-blue w-10 m-2"
                       value={this.state.reverse ? 'Normal Filter' : 'Reverse Filter'} onClick={this.handleClick}/>
            </Fragment>

        );
    }
}


const mapStateToProps = (state) => {
    return {
        filters: state.AutoRetrieveResultList.filters
    }
}

const mapDispatchToProps = {
    saveFilters
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomFilter)
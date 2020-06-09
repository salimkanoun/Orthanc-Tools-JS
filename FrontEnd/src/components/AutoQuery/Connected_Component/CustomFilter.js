import React, { Component, Fragment } from 'react'
import Select from 'react-select'

class CustomFilter extends Component {

    state = {
        reverse: false,
        lastValues: []
    }

    constructor(props){
        super(props)
        this.filter = this.filter.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    filter(reverse, options){
        let values = []
        options ? options.forEach(element => values.push(element.value)) : values = this.state.lastValues
        this.setState({
            lastValues: values
        })
        
        if (reverse){
            let answer = []
            this.props.options.forEach(element => {
                if (!values.includes(element.value)) answer.push(element.value)
            })
            if(answer.length === 0 ) answer = ['']
            values = answer
        }
        this.props.onFilter(values)

        this.props.saveValues() //save filtered values into the redux 
    }

    handleClick(e){
        e.stopPropagation()
        this.setState({
            reverse: !this.state.reverse
        })
        this.filter(!this.state.reverse)
    }


    render() {
        const customStyles = {
            option: (provided, state) => ({
                ...provided, 
                color: this.state.reverse ? 'red' : 'blue'
            })
        }
        return (
            <Fragment>
                <Select isMulti options={this.props.options} onChange={(values)=> this.filter(this.state.reverse, values ? values : [])} styles={customStyles} />
                <input type="button" className="btn btn-info m-2" value={this.state.reverse ? 'Normal Filter' : 'Reverse Filter'} onClick={this.handleClick} />
            </Fragment>
            
        );
    }
}

export default CustomFilter;
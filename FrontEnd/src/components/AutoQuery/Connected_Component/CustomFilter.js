import React, { Component } from 'react'
import Select from 'react-select'

class CustomFilter extends Component {

    static defaultProps = {
        reverse: false
    }

    constructor(props){
        super(props)
        this.filter = this.filter.bind(this)
    }

    filter(){
        let values = []
        this.node.select.state.selectValue.forEach(element => values.push(element.value))
        if (this.props.reverse){
            let answer = []
            this.props.options.forEach(element => {
                if (!values.includes(element.value)) answer.push(element.value)
            })
            this.props.onFilter(answer)
        } else this.props.onFilter(values)
        
    }


    render() {
        return (
            <Select isMulti options={this.props.options} onInputChange={this.filter} ref={n => this.node = n} />
        );
    }
}

export default CustomFilter;
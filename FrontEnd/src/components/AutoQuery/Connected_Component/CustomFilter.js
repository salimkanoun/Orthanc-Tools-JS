import React, { Component, Fragment } from 'react'
import Select from 'react-select'

class CustomFilter extends Component {

    constructor(props){
        super(props)
        this.filter = this.filter.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.state = {reverse: false}
    }

    filter(){
        let values = []
        this.node.select.state.selectValue.forEach(element => values.push(element.value))
        if (this.state.reverse){
            let answer = []
            this.props.options.forEach(element => {
                if (!values.includes(element.value)) answer.push(element.value)
            })
            this.props.onFilter(answer)
        } else this.props.onFilter(values)
        
    }

    async handleClick(e){
        e.stopPropagation()
        await this.setState({
            reverse: !this.state.reverse
        })
        this.filter()
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
                <Select isMulti options={this.props.options} onInputChange={this.filter} ref={n => this.node = n} styles={customStyles}/>
                <input type="button" className="btn btn-info m-2" value={this.state.reverse ? 'Normal Filter' : 'Reverse Filter'} onClick={this.handleClick} />
            </Fragment>
            
        );
    }
}

export default CustomFilter;
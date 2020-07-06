import React, { Component } from 'react'

class InputPassword extends Component {

    state = { 
        password: ''
    }

    constructor(props){
        super(props)
        this.changeListener = this.changeListener.bind(this)
        this.saveListener = this.saveListener.bind(this)
    }

    componentDidMount() {
        this.setState({
            password: this.props.previousPassword
        })
    }

    changeListener(event){
        if(event.target !== null){
            this.setState({
                password: event.target.value
            })
        }
    }

    saveListener(){
        this.props.onUpdate(this.getValue())
    }

    getValue(){
        return this.state.password
    }

    render() {
        return (
            <input name='password' type="password" className="form-control" placeholder="password" onBlur={this.saveListener} value={this.state.password} onChange={this.changeListener}></input>
        );
    }
}

export default InputPassword;
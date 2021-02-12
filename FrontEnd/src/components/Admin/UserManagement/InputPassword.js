import React, { Component } from 'react'

export default class InputPassword extends Component {

    state = {
        password: ''
    }

    componentDidMount = () => {
        if (this.props.previousPassword != null) {
            this.setState({
                password: this.props.previousPassword
            })
        }
    }

    changeListener = (event) => {
        if (event.target !== null) {
            this.setState({
                password: event.target.value
            })
        }
    }

    render = () => {
        return (
            <input name='password' type="password" className="form-control" placeholder="password" onBlur={() => { this.props.onUpdate(this.state.password) }} value={this.state.password} onChange={this.changeListener}></input>
        );
    }
}
import React, { Component } from 'react'

export default class Aet_Form extends Component {

    constructor(props) {
        super(props)
        this.handleChange=this.handleChange.bind(this)
        this.handleClick=this.handleClick.bind(this)
    }

    handleChange(event) {
        const target = event.target
        const name = target.name
        const value = target.type === 'checkbox' ? target.checked : target.value
        
        this.setState({
            [name]: value
        })

    }


    async handleClick() {
        //SK A FAIRE
        let postString = JSON.stringify({ hour: this.state.hour, min: this.state.min })

        let putAnswer = await fetch("/api/aets",
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: postString
            }).then((answer) => {
                return (answer.json())
            })

        console.log(putAnswer)

    }

    render() {
        return (
            <div className="jumbotron" >
                <div>
                    <h2 className="card-title">Add Aet</h2>
                    <label htmlFor="name">Name : </label>
                    <input type='text' name="name" className="row form-control" onChange={this.handleChange} />
                    <label htmlFor="aetName">Aet Name : </label>
                    <input type='text' name="aetName" className="row form-control" onChange={this.handleChange} />
                    <label htmlFor="ip">IP : </label>
                    <input type='text' name="ip" className="row form-control" onChange={this.handleChange} />
                    <label htmlFor="port">Port : </label>
                    <input type='number' name="port" className="row form-control" onChange={this.handleChange} />
                    <input type='buttton' className='row btn btn-primary' onClick={this.handleClick} value='send' />
                </div>
            </div>
        )
    }
}

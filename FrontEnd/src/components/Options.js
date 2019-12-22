import React, { Component } from 'react'

export default class Options extends Component {

    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.state = {
            hour: '00',
            min: '00'
        }
    }

    /**
     * Get defined schedule hour and min from backend
     */
    async componentDidMount() {

        let response = await fetch('/options').then((answer) => { return answer.json() })
        this.setState({
            hour: response.hour,
            min: response.min
        })

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
        let putString = JSON.stringify({ hour: this.state.hour, min: this.state.min })

        let putAnswer = await fetch("/options",
            {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: putString
            }).then((answer) => {
                return (answer.json())
            })

        console.log(putAnswer)

    }

    render() {
        return (
            <div className="jumbotron" >
                <div>
                    <h2 className="card-title">Retrieve Schedule Time</h2>
                    <label htmlFor="hour">Hour : </label>
                    <input type='number' name="hour" className="row form-control" onChange={this.handleChange} value={this.state.hour} />
                    <label htmlFor="min">Minutes : </label>
                    <input type='number' name="min" className="row form-control" onChange={this.handleChange} value={this.state.min} />
                    <input type='button' className='row btn btn-primary' onClick={this.handleClick} value='send' />
                </div>

            </div>
        )
    }
}

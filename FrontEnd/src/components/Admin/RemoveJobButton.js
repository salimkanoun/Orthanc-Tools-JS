import React, { Component } from 'react'

export default class RemoveJobButton extends Component {

    constructor(props){
        super(props)
        this.deleteJobHandler = this.deleteJobHandler.bind(this)
    }


    render() {
        return <div className="text-center">
                <input type="button" className='btn btn-danger' onClick={this.deleteJobHandler} value = "Remove Job" />
                </div>
    }



    deleteJobHandler () {
        let self = this
        console.log(this.props)
        fetch("/api/robot/"+this.props.username, {
            method: "DELETE"
            })
            .then(()=>{
               self.props.refreshHandler()
            }).catch( (error)=>{ console.log(error) } )

    }
}
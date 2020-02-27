import React, { Component, Fragment } from 'react'
import Aets from './Aets'
import AetForm from './AetForm'

export default class AetPanel extends Component {

    state = {
        aets : []
    }

    constructor(props){
        super(props)
        this.refreshAetsData = this.refreshAetsData.bind(this)
    }

    componentDidMount(){
        this.refreshAetsData()
    }

    async refreshAetsData(){

        let aetsAnswer = await fetch("/api/aets", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((answer)=>{
            return answer.json()})
        
        let rows = []

        aetsAnswer.forEach(aet => {
            rows.push({
                key : Math.random(),
                name : aet.name,
                aetName : aet.aetName,
                ip : aet.ip,
                port : aet.port,
                manufacturer : aet.manufacturer
            })
        });

        this.setState({
            aets : rows
        })

    }

    render(){
        return (
            <Fragment>
                <AetForm refreshAetData={this.refreshAetsData} />
                <Aets rows={this.state.aets} refreshAetData={this.refreshAetsData} />
            </Fragment>
        )
    }

}
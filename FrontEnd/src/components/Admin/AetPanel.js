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
        for (const property in aetsAnswer) {
            rows.push({
                name : property,
                aetName : aetsAnswer[property].AET,
                ip : aetsAnswer[property].Host,
                port : aetsAnswer[property].Port,
                manufacturer : aetsAnswer[property].Manufacturer
            })

        }

        this.setState({
            aets : rows
        })

    }

    render(){
        return (
            <Fragment>
                <Aets rows={this.state.aets} refreshAetData={this.refreshAetsData} />
                <AetForm refreshAetData={this.refreshAetsData} />
            </Fragment>
        )
    }

}
import React, { Component } from 'react'
import apis from '../../services/apis'

export default function tableStudyFillFromParent (TableStudy) {
    
    return class extends Component {

        state = {
            studies : []
        }

        async componentDidMount(){
            let studiesDetails = await apis.content.getStudiesDetails(this.props.studiesID)
            this.setState({
                studies : studiesDetails
            })
        }

        render(){
            return(
                <TableStudy data={this.state.studies} {...this.props} />
            )
        }
    }
}
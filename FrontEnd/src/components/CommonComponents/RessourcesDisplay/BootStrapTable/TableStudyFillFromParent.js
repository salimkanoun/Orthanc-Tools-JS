import React, {Component} from 'react'
import apis from '../../../../services/apis'
import TableStudy from '../TableStudy'

export default class TableStudyFillFromParent extends Component {

    state = {
        studies: []
    }

    componentDidMount = async () => {
        let studiesDetails = await apis.content.getStudiesDetails(this.props.studiesID)
        this.setState({
            studies: studiesDetails
        })
    }

    render = () => {
        return (
            <TableStudy data={this.state.studies} {...this.props} />
        )
    }
}
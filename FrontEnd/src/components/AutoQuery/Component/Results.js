import React, { Component, Fragment } from 'react';
import TableResultsStudiesSeries from '../Connected_Component/TableResultsStudiesSeries'
import TableResultStudy from '../Connected_Component/TableResultStudy'


import CreateRobot from '../Component/CreateRobot'


export default class Results extends Component {

    state = {
        seriesView : false
    }

    constructor(props){
        super(props)
        this.filterSeriesListener = this.filterSeriesListener.bind(this)
    }

    filterSeriesListener () {
        this.setState(state => {
            return {seriesView : !state.seriesView}
        })
    }

    render() {
        return (
            <Fragment>
                <div >
                    <input type="button" className="btn btn-warning float-right" value="Filter Series" onClick = {this.filterSeriesListener}/>
                </div>
                <div >
                    { this.state.seriesView === true ? <TableResultsStudiesSeries /> : <TableResultStudy /> }
                </div>
                <div className="text-center">
                    <CreateRobot resultArray={this.props.results} switchTab = {this.props.switchTab} ></CreateRobot>
                </div>
            </Fragment>
        )
    }

}
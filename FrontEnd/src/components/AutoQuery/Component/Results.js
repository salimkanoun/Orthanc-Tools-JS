import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'

import TableResultsStudiesSeries from '../Connected_Component/TableResultsStudiesSeries'
import TableResultStudy from '../Connected_Component/TableResultStudy'


import CreateRobot from '../Component/CreateRobot'


class Results extends Component {

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

    buildArrayRetrieve(){

        let resultObject= this.props.results

        if ( Object.keys(this.props.resultsSeries)>0 ) {
            resultObject = this.props.resultsSeries
        }

        let retrieveArray =[]
        for(let retrieveItemUID of Object.keys(resultObject)){
            retrieveArray.push( {...resultObject[retrieveItemUID]} )
        }

        return retrieveArray 
        
    }

    render() {
        return (
            <Fragment>
                <div >
                    <input type="button" className="btn btn-warning float-right" value={this.state.seriesView === true ? "Filter Studies" : "Filter Series"} onClick = {this.filterSeriesListener}/>
                </div>
                <div >
                    { this.state.seriesView === true ? <TableResultsStudiesSeries /> : <TableResultStudy /> }
                </div>
                <div className="text-center">
                    <CreateRobot resultArray={this.buildArrayRetrieve()} switchTab = {this.props.switchTab} ></CreateRobot>
                </div>
            </Fragment>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        results : state.AutoRetrieveResultList.results,
        resultsSeries: state.AutoRetrieveResultList.resultsSeries
    }
}

export default connect(mapStateToProps, null)(Results);